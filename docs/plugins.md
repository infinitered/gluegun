# Plugins

Functionality is added to the `CLI runtime` with plugins. Plugins can be yours or the end users.

A plugin is directory that contains 3 optional sub-directories:

* `commands`
* `templates`
* `extensions`

And 1 optional file, which can be `<brand>.config.js`, `.<brand>rc.json`, or `.<brand>rc.yaml`. Replace `<brand>` with the name of your CLI.

Other than the 3 directories listed, you're welcome to put any other files or sub-directories in the plugin directory.

Since multiple plugins can be loaded, they must have unique names. The names are indicated by reading the `name` property of the configuration (more on this below), or the plugin directory name itself.

## commands

Commands are run from the command line (CLI).

```
movies actor
```

Here, the `actor` command is run. It is a JS file (`commands/actor.js`) that exports a structure that looks something like this:

```js
module.exports = {
  name: 'actor',
  alias: ['a'],
  description: 'Displays the name of an actor',
  hidden: false,
  dashed: false,
  run: async toolbox => {
    const { print } = toolbox

    print.info(`Tom Hanks`)
  },
}
```

The `name` and `description` properties are used in `printCommands` calls to print out some help in a table.

`alias` allows you to invoke these commands using an alias.

`hidden` says whether to show the command in help screens or not.

`dashed` lets you run the command as a dashed command, like `--version` or `-v`.

The `run` property should be a function (async or not) that does whatever you want it to. You'll receive the gluegun `toolbox` object which contains the [core extensions](./toolbox-api.md) and any additional extensions you've loaded.

## templates

Templates are [ejs](http://www.embeddedjs.com/) files that get translated by a command into a source code file or similar.

TODO: Add more info, including examples.

## extensions

Extensions are additional functionality that you can monkeypatch onto the `toolbox` object. They look something like this:

```js
// extensions/sayhello.js
module.exports = (toolbox) {
  const { print } = toolbox

  toolbox.sayhello = () => {
    print.info('Hello from an extension!')
  }
}
```

When you have this extension, you can access it in any command file, like this:

```js
// ...
run: async toolbox => {
  const { sayhello } = toolbox

  sayhello()

  // or

  toolbox.sayhello()
}
```

# Configuration File

Gluegun uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) to determine configuration. It can be:

* an object under the `<brand>` key in the `package.json`
* a `.<brand>rc` file (containing either yaml or json)
* `.<brand>rc.json` file
* `.<brand>rc.yaml` file
* `<brand>.config.js` JS file that exports an object

In this configuration, you can configure your plugin's name and also set up certain user-overridable defaults.

## name

The name of your plugin. This is also used to prefix your plugin's commands.

```json
{
  "name": "something"
}
```

Since many plugins can be installed, we recommend namespacing them with your CLI. For example, for [Ignite](https://github.com/infinitered/ignite) plugins we have `ignite-i18n`, `ignite-maps`, etc. For [Solidarity](https://github.com/infinitered/solidarity), we have `solidarity-react-native` and `solidarity-elixir`.

A name:

* can contain **numbers & letters**
* should be **lowercase**
* spaces-should-have-**dashes**-if-you-need-them

If `name` does not exist, the default will be the name of the directory.

## defaults

Default configuration settings which may be used by your commands and overridden by end users.

```json
{
  "semicolons": true,
  "colorTheme": ["red", "no", "blue", "aaaaaaaaa"]
}
```

If you'd like to follow a tutorial to make a plugin, check out the ["Making a Plugin" tutorial](./tutorial-making-a-plugin.md).
