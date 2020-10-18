Provides access to shell and OS processes.

You can access these tools on the Gluegun toolbox, via `const { system } = require('gluegun')`, or directly via `const { system } = require('gluegun/system')`.

## run

> This is an **async** function.

Runs a shell command and returns the output as a string.

The first parameter `commandLine` is the shell command to run. It can have pipes! The
second parameter is `options`, object. This is a promise wrapped around node.js `child-process.exec`
[api call](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback).

You can also pass `trim: true` inside the options parameter to have the output automatically trim all
starting and trailing spaces.

Should the process fail, an `error` will be thrown with properties such as:

| property | type   | purpose                                               |
| -------- | ------ | ----------------------------------------------------- |
| code     | number | the exit code                                         |
| cmd      | string | the command we asked to run                           |
| stdout   | string | any information the process wrote to `stdout`         |
| stderr   | string | any information the process wrote to `stderr`         |
| killed   | bool   | if the process was killed or not                      |
| signal   | number | the signal number used to off the process (if killed) |

```js
const nodeVersion = toolbox.system.run('node -v', { trim: true })
```

### toolbox.system.which

Returns the full path to a command on your system if located on your path.

```js
const whereIsIt = toolbox.system.which('npm')
```

### toolbox.system.open

:(

### toolbox.system.startTimer

Starts a timer for... well... timing stuff. `startTimer()` returns a function. When this is called, the number of milliseconds will be returned.

```js
const timer = toolbox.system.startTimer()

// time passes...
console.log(`that just took ${timer()} ms.`)
```

Caveat: Due to the event loop scheduler in Node.JS, they don't guarantee millisecond accuracy when invoking async functions. For that reason, expect a up to a 4ms overage.

Note that this lag doesn't apply to synchronous code.
