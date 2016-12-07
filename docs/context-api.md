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
**http**        | ability to talk to the web                          | axios

If this is starting to sound like a scripting language, then good.  That's exactly how to think of it.  Except
we're not inventing another language.  And we're still running in a `node.js` environment, so you can do whatever you want.

# context.parameters
Information about how the command was invoked. Most of the time this is from the comand line, however, 
it is possible to call it from the API if you're writing your own CLI.

Check out this example of creating a new Reactotron plugin.

```sh
staple reactotron plugin MyAwesomePlugin full --comments --lint standard
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
staple say hello --loud -v --wave furiously
```

```js
module.exports = async function (context) {
  context.parameters.options // { loud: true, v: true, wave: 'furiously' }
}
```

### context.parameters.string
Everything else after the command as a string.

```sh
staple say hello there
```

```js
module.exports = async function (context) {
  context.parameters.string // 'hello there'
}
```

### context.parameters.array
Everything else after the command, but as an array.

```sh
staple reactotron plugin full
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
staple reactotron plugin full
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
  "staplegun": {
    "namespace": "myPlugin",
    "defaults": { "fun": false, "level": 10 }
  }
}

// package.json from the user
{
  "staplegun": {
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
    template: 'templates/component.njk',
    target: `app/components/${name}-view.js`,
    props: { name, semicolon },
    askToOverwrite: true
  })

}
```


option           | type    | purpose                              | notes
-----------------|---------|--------------------------------------|----------------------------
`template`       | string  | path to the Nunjucks template        | relative from plugin directory 
`target`         | string  | path to create the file              | relative from user's working directory  
`props`          | object  | more data to render in your template | 
`askToOverwrite` | boolean | show a prompt before overwriting?    | 

`generate()` returns the string that was generated in case you didn't want to render to a target.


# context.prompt

Let's drop `inquirer` here.

# context.filesystem

Honestly, the `fs-jetpack` API is so well done, let's just drop that here. Provide examples.

# context.system

### context.system.execute
:(

### context.system.open
:(

### context.system.copyToClipboard
:(


# context.http 

`axios` gets this spot.  Provide examples though.