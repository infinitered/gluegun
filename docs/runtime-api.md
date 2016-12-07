# Runtime API

The runtime is the environment for running a user's request through the gauntlet.

You register your extension and plugins with it, then kick of a run targeting a command.

# Adding Plugins

Plugins are added via `.addPlugin()`.  This function takes 1 parameter called `plugin`.

And that's not very helpful at all right?

So how do you load a plugin?

```js
const { loadPluginFromPackageJson } = require('staplegun')

runtime.addPlugin(loadPluginFromPackageJson('/path/to/some/directory'))
```

# Adding Extensions

Extensions give `context` extra powers.

You can add another property to `context` to make it available to any command & plugin that runs.

```js
/**
 * An extension is a factory function that takes 3 parameters.
 *
 * @param  {plugin}  plugin  The plugin that is currently running.
 * @param  {command} command The command that is currently running.
 * @param  {context} context The context that is currently running.
 * @return {object}          An object you want to make available.
 */
function myExtension (plugin, command, context) {

  // and returns an object
  return {
    // with values
    spaghetti: true

    // or with functions that people can call
    hello: async function (name) {
      context.print.success(`hello ${name}!`)
    }
  }
}

// you add the extension to the runtime before calling `run()`.
//
// The first parameter is new key that appears for the context.
// The 2nd parameter is your extension function as seen above.
runtime.addExtension('myExtension', myExtension)
```
