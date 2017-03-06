## run

> This is an **async** function.

Runs a shell command and returns the output as a string.

The first parameter `commandLine` is the shell command to run.  It can have pipes! The
second parameter is `options`, object. This is a promise wrapped around node.js `child-process.exec`
[api call](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback). 

You can also pass `trim: true` inside the options parameter to have the output automatically trim all
starting and trailing spaces.

Should the process fail, an `error` will be thrown with properties such as:

property | type   | purpose
---------|--------|------------------------------------------------------------
code     | number | the exit code
cmd      | string | the command we asked to run
stderr   | string | any information the process wrote to `stderr`
killed   | bool   | if the process was killed or not
signal   | number | the signal number used to off the process (if killed)

```js
const nodeVersion = context.system.run('node -v', { trim: true })
```

### context.system.which

Retursn the full path to a command on your system if located on your path.

```js
const whereIsIt = context.system.which('npm')
```

### context.system.open
:(

### context.system.readFromClipboard

Grabs the text currently on the clipboard and returns it as a string.

```js
const password = context.system.readFromClipboard() // ya, don't be a bad person
```

### context.system.writeToClipboard

Copies the given text to the clipboard.

```js
context.system.writeToClipboard('8675309')
```
