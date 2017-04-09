Features for allowing you to print to the console.


## info
Prints an informational message.  Use this as your goto.

```js
context.print.info('Hello.  I am a chatty plugin.')
```

## success
Print a "something good just happened" message.

```js
context.print.success('We did it!')
```

## warning
Prints a warning message.  Use this when you feel a disturbance in the force.

```js
context.print.warning('Your system does not have Yarn installed.  It\'s awesome.')
```

## error
Prints an error message.  Use this when something goes Pants-On-Head wrong.
What does that mean?  Well, if your next line of code isn't `process.exit(0)`, then
it was probably a warning.

```js
context.print.error('Out of disk space.  lol.')
```

## debug
Only used for debugging your plugins. You can pass this function a string or an object.

```js
context.print.debug(someObject, 'download status')
``` 

The `message` parameter is object you would like to see.

The `title` is an optional title message which is handy if you've got a lot of debug messages
and you're losing track of which one is which.

## colors
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

## spin
Creates a spinner for long running tasks on the command line.  It's [ora](https://github.com/sindresorhus/ora)!

Here's an example of how to work with it:

```js
// a spinner starts with the text you provide
const spinner = context.print.spin('Time for fun!')
await context.system.run('sleep 5')
```

🚨 Important 🚨 - Make sure you don't print anything else while a spinner is going.  You need to stop it first.

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
spinner.text = context.print.colors.green('i like trees')
```
