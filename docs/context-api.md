# Inside Context

So you're making a plugin. Let's get started.

```js
module.exports = async function (context) {
  
  // great! now what?

}
```

Here's what's available inside `context` object.

name            | provides the...                                     | 3rd party 
----------------|-----------------------------------------------------|--------
**parameters**  | command line arguments and options                  | minimist
**config**      | configuration options from the app or plugin        | 
**print**       | tools to print output to the command line           | colors
**template**    | code generation from templates                      | nunjucks
**prompt**      | tools to acquire extra command line user input      | inquirer
**filesystem**  | ability to copy, move & delete files & directories  | fs-jetpack
**system**      | ability to execute & copy to the clipboard          | cross-env
**http**        | ability to talk to the web                          | apisauce
**strings**     | some string helpers like case conversion, etc.      | lodash & ramda

If this is starting to sound like a scripting language, then good.  That's exactly how to think of it.  Except
we're not inventing another language.  And we're still running in a `node.js` environment, so you can do whatever you want.

# context.parameters
Information about how the command was invoked. Most of the time this is from the comand line, however, 
it is possible to call it from the API if you're writing your own CLI.

Check out this example of creating a new Reactotron plugin.

```sh
glue reactotron plugin MyAwesomePlugin full --comments --lint standard
```

name          | type   | purpose                           | from the example above
--------------|--------|-----------------------------------|------------------------------------
**namespace** | string | the namespace used                | `'reactotron'`
**command**   | string | the command used                  | `'plugin'`
**string**    | string | the command arguments as a string | `'MyAwesomePlugin full'`
**array**     | array  | the command arguments as an array | `['MyAwesomePlugin', 'full']`
**first**     | string | the 1st argument                  | `'MyAwesomePlugin'`
**second**    | string | the 2nd argument                  | `'full'`
**third**     | string | the 3rd argument                  | `undefined`
**options**   | object | command line options              | `{comments: true, lint: 'standard'}`

### context.parameters.options
Options are the command line flags. Always exists however it may be empty.

```sh
gluegun say hello --loud -v --wave furiously
```

```js
module.exports = async function (context) {
  context.parameters.options // { loud: true, v: true, wave: 'furiously' }
}
```

### context.parameters.string
Everything else after the command as a string.

```sh
gluegun say hello there
```

```js
module.exports = async function (context) {
  context.parameters.string // 'hello there'
}
```

### context.parameters.array
Everything else after the command, but as an array.

```sh
gluegun reactotron plugin full
```

```js
module.exports = async function (context) {
  context.parameters.array // ['plugin', 'full']
}
```

### context.parameters.first / .second / .third
The first, second, and third element in `array`. It is provided as a shortcut, and there isn't one, 
this will be `undefined`.

```sh
gluegun reactotron plugin full
```

```js
module.exports = async function (context) {
  context.parameters.first  // 'plugin'
  context.parameters.second // 'full'
  context.parameters.third  // undefined
}
```

# context.config
This is an object. Each plugin will have it's own root level key. 

It takes the plugin's defaults, and merges the user's changes overtop.

```js
// package.json from the plugin
{
  "gluegun": {
    "namespace": "myPlugin",
    "defaults": { "fun": false, "level": 10 }
  }
}

// package.json from the user
{
  "gluegun": {
    "config": {
      "myPlugin": { "fun": true }
    }
  }
}

```

```js
module.exports = async function (context) {
  context.config.myPlugin // { fun: true, level: 10 }
}
```

# context.print
Features for allowing you to print to the console.

### context.print.stepComplete
Indicates to that something relevant has been done.

```js
context.print.stepComplete('added android permission', 'RECEIVE_SMS')
```

The `action` parameter is string up to 30 characters long. It should be the 
passed-tense verb like "generated" or "deleted".

The `message` parameter is a string up to 80 characters long. It can be anything
relevant to what happened. You're welcome to to use colors here like `highlight` to emphasize your message.

### context.print.debug
Only used for debugging your plugins. You can pass this function a string or an object.

```js
context.print.debug(someObject, 'download status')
``` 

The `message` parameter is object you would like to see.

The `title` is an optional title message which is handy if you've got a lot of debug messages
and you're losing track of which one is which.

### context.print.colors
An object for working with printing colors on the command line. It is from the `colors` NPM package, 
however we define a theme to make things a bit consistent.

Some available functions include:

function           | use when you want...
------------------ | ------------------------------------------------------
`colors.success()` | the user to smile
`colors.error()`   | to say something has failed
`colors.warn()`    | to point out that something might be off
`colors.info()`    | to say something informational
`colors.muted()`   | you need to say something secondary

Each take a `string` parameter and return a `string`. 

One gotcha here is that the length of the string is longer than you think
because of the embedded color codes that disappear when you print them. 🔥


# context.template
Features for generating files based on a template.

### context.template.generate

**async** - don't forget to prefix calls to this function with `await` if you want to wait until it finishes before continuing.

Generates a new file based on a template.

```js
module.exports = async function (context) {
  
  const name = context.parameters.first
  const semicolon = context.options.useSemicolons && ';'

  await context.template.generate({
    template: 'component.njk',
    target: `app/components/${name}-view.js`,
    props: { name, semicolon }
  })

}
```

Note: `generate()` will always overwrite the target if given.  Make sure to prompt your users if that's
the behaviour you're after.

option           | type    | purpose                              | notes
-----------------|---------|--------------------------------------|----------------------------
`template`       | string  | path to the Nunjucks template        | relative from plugin's `templates` directory 
`target`         | string  | path to create the file              | relative from user's working directory  
`props`          | object  | more data to render in your template | 

`generate()` returns the string that was generated in case you didn't want to render to a target.


# context.prompt

### context.prompt.ask

**async**

This is the lovely and talented [inquirer.js](https://github.com/SBoudrias/Inquirer.js).  Here's some examples:

```js
// a thought-provoking question
const askAge = { 
  type: 'input', 
  name: 'age', 
  message: 'How old are you?'
  }

// now let's get to what we REALLY want to know...
const askShoe = { 
  type: 'input', 
  name: 'shoe', 
  message: 'What shoes are you wearing?', 
  choices: ['Clown', context.prompt.separator(), 'Other'] 
  }

// ask the question
const { age, shoe } = await context.prompt.ask([askAge, askShoe])
```

### context.prompt.separator

Call `context.prompt.separator()` to return a separator you can use in some of your questions.

### context.prompt.askToOverwrite

A pre-built prompt which asks the user if they would like to overwrite a file.  The first parameter
to this function is `message` which can be customized to what you need.  The function returns `boolean`.

# context.filesystem

Honestly, the `fs-jetpack` API is so well done, let's just drop that here. Provide examples.

# context.system

### context.system.run

**async**

Runs a shell command and returns the output as a string.

The first parameter `commandLine` is the shell command to run.  It can have pipes! The
second parameter is `options`, object. This is a promise wrapped around node.js `child-process.exec`
[api call](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback).  

Should the process fail, an `error` will be thrown with properties such as:

property | type   | purpose
---------|--------|------------------------------------------------------------
code     | number | the exit code
cmd      | string | the command we asked to run
stderr   | string | any information the process wrote to `stderr`
killed   | bool   | if the process was killed or not
signal   | number | the signal number used to off the process (if killed)


### context.system.open
:(

### context.system.copyToClipboard
:(


# context.strings

Provides some helper functions to work with strings.  This list is also added to the available filters
inside your Nunjucks templates.

function    | parameters          | usage
------------|---------------------|---------------------------------------
identity    | value               | returns itself
isBlank     | value               | true if its null, or trimmed to empty
isNotString | value               | true if it's not `typeof 'string'`
camelCase   | value               | thisIsCamelCase
kebabCase   | value               | this-is-kebab-case
snakeCase   | value               | this_is_snake_case
upperCase   | value               | THIS IS UPPER CASE
lowerCase   | value               | this is lower case
startCase   | value               | This is start case
upperFirst  | value               | Changes the first character to upper case
lowerFirst  | value               | changes the first character to lower case 
pascalCase  | value               | ThisIsPascalCase
pad         | value, length, char | Pads a string to a length with by filling char
padStart    | value, length, char | Pads the start of a string
padEnd      | value, length, char | Pads the end of string
trim        | value, length, char | Removes whitespace from the edges
trimStart   | value               | Removes whitespace from the front
trimEnd     | value               | Removes whitespace from the back
repeat      | value, count        | Repeats a value, count times


# context.http

Gives you the ability to talk to HTTP(s) web and API servers using [apisauce](https://github.com/skellock/apisauce) which
is a thin wrapper around [axios](https://github.com/mzabriskie/axios).

### context.http.create

This creates an `apisauce` client.  It takes 1 parameter called `options` which is an object.

```js
const api = context.http.create({
  baseURL: 'https://api.github.com',
  headers: {'Accept': 'application/vnd.github.v3+json'}
})
```

Once you have this api object, you can then call `HTTP` verbs on it. All verbs are `async` so don't forget your `await` call.

```js
// GET
const { ok, data } = await api.get('/repos/skellock/apisauce/commits')

// and others
api.get('/repos/skellock/apisauce/commits')
api.head('/me')
api.delete('/users/69')
api.post('/todos', {note: 'jump around'}, {headers: {'x-ray': 'machine'}})
api.patch('/servers/1', {live: false})
api.put('/servers/1', {live: true})
```

