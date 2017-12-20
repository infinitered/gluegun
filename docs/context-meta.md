Provides functions for accessing information about the currently running CLI.

## version

Retrieves the currently running CLI's version.

```js
context.meta.version() // '1.0.0'
```

## commandInfo

Retrieves information about all of this CLI's commands. You can use this to display a custom help screen, for example.

```js
const commandInfo = context.meta.commandInfo()
context.print.table(commandInfo)
```
