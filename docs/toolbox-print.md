Features for allowing you to print to the console.

You can access these tools on the Gluegun toolbox, via `const { print } = require('gluegun')`, or directly via `const { print } = require('gluegun/print')`.

## info

Prints an informational message. Use this as your goto.

```js
toolbox.print.info('Hello.  I am a chatty plugin.')
```

## success

Print a "something good just happened" message.

```js
toolbox.print.success('We did it!')
```

## warning

Prints a warning message. Use this when you feel a disturbance in the force.

```js
toolbox.print.warning("Your system does not have Yarn installed.  It's awesome.")
```

## error

Prints an error message. Use this when something goes Pants-On-Head wrong. What does that mean?
Well, if your next line of code isn't `process.exit(0)`, then it was probably a warning.

```js
toolbox.print.error('Out of disk space.  lol.')
```

## highlight

Prints a message that's intended to have attention drawn to it.
You could use it to point out the correct command to be run in an error message.
Or you could use it to head sections of your help screen printout.

```js
toolbox.print.highlight('Run `gluegun login` to login')
```

## muted

Prints a message in a muted gray color.
This is useful for info that's not the most important but still helpful.
Think of mundane or commonplace lines in output logging, for example.

```js
toolbox.print.muted('Connection status: GOOD')
```

## debug

Only used for debugging your plugins. You can pass this function a string or an object.

```js
toolbox.print.debug(someObject, 'download status')
```

The `message` parameter is object you would like to see.

The `title` is an optional title message which is handy if you've got a lot of debug messages and
you're losing track of which one is which.

## colors

An object for working with printing colors on the command line. It is from the `colors` NPM package,
however we define a theme to make things a bit consistent.

Some available functions include:

| function             | use when you want...                     |
| -------------------- | ---------------------------------------- |
| `colors.success()`   | the user to smile                        |
| `colors.error()`     | to say something has failed              |
| `colors.warning()`   | to point out that something might be off |
| `colors.highlight()` | to draw attention to something           |
| `colors.info()`      | to say something informational           |
| `colors.muted()`     | you need to say something secondary      |

Each take a `string` parameter and return a `string`.

One gotcha here is that the length of the string is longer than you think because of the embedded
color codes that disappear when you print them. 🔥

## spin

Creates a spinner for long running tasks on the command line. It's
[ora](https://github.com/sindresorhus/ora)!

Here's an example of how to work with it:

```js
// a spinner starts with the text you provide
const spinner = toolbox.print.spin('Time for fun!')
await toolbox.system.run('sleep 5')
```

🚨 Important 🚨 - Make sure you don't print anything else while a spinner is going. You need to stop
it first.

There's a few ways to stop it.

```js
// stop it & clear the text
spinner.stop()

// stop it, leave a checkmark, and optional new text
spinner.succeed('woot!')

// stop it, leave an X, and optional new text
spinner.fail('womp womp.')

// stop it, leave a custom label, and optional new text
spinner.stopAndPersist({ symbol: '🚨', text: 'osnap!' })
```

Once stopped, you can start it again later.

```js
spinner.start()
```

You can change the color of the spinner by setting:

```js
spinner.color = 'cyan'
```

The text can also be set with the normal printing colors.

```js
spinner.text = toolbox.print.colors.green('i like trees')
```

## printHelp

Prints a default help screen, consisting of the brand name, version, and `printCommands` output (next).

```js
const { printHelp } = toolbox.print
printHelp(toolbox)
```

## printCommands

Prints out a table of available commands in a given toolbox.

```js
const { printCommands } = toolbox.print
printCommands(toolbox)
```

You can pass in a "command path" to refine what commands you'd like to see:

```js
const { printCommands } = toolbox.print
printCommands(toolbox, ['generate', 'model'])
```

## table

Prints out a table of data, including a header. You can choose from three different formats:
`default`, `markdown`, and `lean`.

```js
const { table } = toolbox.print
table(
  [
    ['First Name', 'Last Name', 'Age'],
    ['Jamon', 'Holmgren', 35],
    ['Gant', 'Laborde', 36],
    ['Steve', 'Kellock', 43],
    ['Gary', 'Busey', 73],
  ],
  { format: 'markdown' },
)
```

Output:

```
| First Name | Last Name | Age |
| ---------- | --------- | --- |
| Jamon      | Holmgren  | 35  |
| Gant       | Laborde   | 36  |
| Steve      | Kellock   | 43  |
| Gary       | Busey     | 73  |
```

You can also pass styles for the table (as specified in [cli-table3](https://github.com/cli-table/cli-table3)):

```js
const { table } = toolbox.print
table(
  [
    ['First Name', 'Last Name', 'Age'],
    ['Jamon', 'Holmgren', 35],
    ['Gant', 'Laborde', 36],
    ['Steve', 'Kellock', 43],
    ['Gary', 'Busey', 73],
  ],
  {
    format: 'lean',
    style: { 'padding-left': 0 , 'padding-right': 8 }
  },
)
```

Output:

```
┌──────────────────┬─────────────────┬───────────┐
│First Name        │Last Name        │Age        │
├──────────────────┼─────────────────┼───────────┤
│Jamon             │Holmgren         │35         │
├──────────────────┼─────────────────┼───────────┤
│Gant              │Laborde          │36         │
├──────────────────┼─────────────────┼───────────┤
│Steve             │Kellock          │43         │
├──────────────────┼─────────────────┼───────────┤
│Gary              │Busey            │73         │
└──────────────────┴─────────────────┴───────────┘
```
