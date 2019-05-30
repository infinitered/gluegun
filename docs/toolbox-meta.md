Provides functions for accessing information about the currently running CLI. You can access this on the Gluegun toolbox.

## src

The currently running CLI's source folder.

```js
toolbox.meta.src // "/Users/jh/Code/gluegun"
```

## version

Retrieves the currently running CLI's version.

```js
toolbox.meta.version() // '1.0.0'
```

## packageJSON

Retrieves the currently running CLI's package.json contents as an object.

```js
toolbox.meta.packageJSON()
// { name: 'gluegun', version: '9.4.2', ... }
```

## checkForUpdate

Async function that checks NPM to see if there's an update to the currently running CLI.

```js
const newVersion = await toolbox.meta.checkForUpdate()
// false (if none exists)
// '9.4.3' (new version if exists)
if (newVersion) {
  toolbox.print.info(`New version available: ${newVersion})`)
}
```

## commandInfo

Retrieves information about all of this CLI's commands. You can use this to display a custom help screen, for example.

```js
const commandInfo = toolbox.meta.commandInfo()
toolbox.print.table(commandInfo)
```
