# Inside Context

Here's what's available inside context.

|name|provides the...
|---|---|
|**parameters**|command line arguments and options|
|**config**|configuration options from the app or plugin|
|**print**|tools to print output to the command line|
|**template**|code generation from templates|
|**prompt**|tools to acquire extra command line user input
|**filesystem**|ability to copy, move & delete files & directories|
|**system**|ability to execute & copy to the clipboard|
|**http**|ability to to the web|


## context.parameters
Information about how the command was invoked.

### options
Options are the command line flags.  Always exists however it may be empty.

```sh
$ staple say hello --loud -v  # { loud: true, v: true }
$ staple wave --times 5       # { times: 5 } 
```

### string
Everything else after the command as a string.

```sh
$ staple say hello there  # hello there
```

### array
Everything else after the command, but as an array.

```sh
staple reactotron plugin full  # ['plugin', 'full']
```

### first
The first element in `array`.

```sh
staple reactotron plugin full  # plugin
```

### second
The second element in `array`.

```sh
staple reactotron plugin full  # full
```

### third
The third element in `array`.

```sh
staple reactotron plugin full  # undefined
```

### full
This is a string of everything after the namespace.  I'm unclear why I have this here.

## context.config
This is an object.  Each plugin will have it's own root level key. 

It takes the plugin's defaults, and merges the user's changes overtop.

```js
// package.json from the plugin
{
  "staplegun": {
    "namespace": "myPlugin",
    "defaults": {
      "fun": false
    }
  }
}

// package.json from the user
{
  "staplegun": {
    "config": {
      "myPlugin": {
        "fun": true
      }
    }
  }
}

context.config.myPlugin.fun // true
```


## context.print
Features for allowing you to print to the console.

### stepComplete(action, message)
Indicates to that something relevant has been done.

The `action` parameter is string up to 20 characters long.  It should be the 
passed-tense verb like "generated" or "deleted".

The `message` parameter is a string up to 80 characters long.  It can be anything
relevant to what happened.  You're welcome to to use colors here like `highlight` to emphasize your message.

### debug()
Only used for debugging your plugins.  You can pass this function a string or an object. 

### colors
An object for working with printing colors on the command line.  It is from the `colors` NPM package, 
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


## context.template
Features for generating files based on a template.

### generate(options)

Generates a new file based on a template.

option        | type    | purpose                              | notes
--------------|---------|--------------------------------------|----------------------------
`template`    | string  | path to the Nunjucks template        | relative from plugin directory 
`target`      | string  | path to create the file              | relative from user's working directory  
`props`       | object  | more data to render in your template |  

## context.prompt
Features for getting additional information from the user on the command line.

### yesOrNo

:(

### multipleChoice

:(

### input

:(


## context.filesystem

### read(file, format)

Reads a file from the file system.

param    | purpose              | notes
---------|----------------------|----------------------------------------------
`file`   | The path to the file | relative from plugin directory
`format` | Optional format      | `null` - text file<br/>`'json'` - JSON object

:(

### write(file, format)
:(

### copy()
:(

### delete()
:(

### move()
:(

## context.system

### execute
:(

### open
:(

### copyToClipboard
:(

## context.http 
Interact with the information superhighway!

### get
:(

### post
:(

### delete
:(

### head
:(

### put
:(

### patch
:(

### download
:(
