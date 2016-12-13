# Plugins

Functionality is added to the `Runtime` with plugins.  Plugins can be yours or the end users.

A plugin is directory.

It contains 3 optional sub-directories:

* `commands`
* `templates`
* `extensions`

And 1 optional file:

* `<brand>.toml`

Other than the 3 directories listed, you're welcome to put any other files or sub-directories in the plugin directory.

Since multiple plugins can be loaded, they must have unique names.  The names are indicated by reading the `name` property of the `<brand>.toml` inside the plugin directory, or the plugin directory name itself. 

## commands

TODO: What are commands?

## templates

TODO: What are templates?

## extensions

TODO: What are extensions?


`commands` and `extensions` contain plain NodeJS JavaScript files.  Files located in these
directories will be automatically loaded and made available.

At the top of these `*.js` files you have the ability to customize some meta data.

For example, you might have a command called `commands/say.js` that looks like this:

```js
// @cliCommand     say
// @cliDescription This command will say the word you tell it to.
module.exports = async function (context) {
  const { print, parameters } = context  
  print.info(`hello ${parameters.first}`)
}
```

This `@cliCommand` and the `@cliDescription` will be detected and will populate the information that
the user sees when they ask for help or a list of commands.

Extensions are similar except they use the `@contextExtension` 

```js
// @contextExtension   appstore
module.exports = function (plugin, command, context) {

  async function getAppDetails (productId) {
    const api = context.http.api('https://appstore.apple.com/path/to/service')
    const { ok, data } = await api.get('/product', { productId })
    if (ok) {
      context.print.warning('iFailed')
      return null
    } else {
      return data
    }
  }

  return {
    getAppDetails
  }
}  
```


# Configuration File `gluegun.toml`

## name

The name is a prefix to your commands.

```toml
name = 'something'
```

Since many plugins can be installed, we namespace them. If you're creating plugins
for others to use, try to be very specific about the name. Naming it after a project
is a good idea (e.g. `ignite` or `reactotron`). Calling it `dev` or `internet` is
probably asking for trouble.

If you're just making plugins for your project, then please, feel free to call it
whatever you'd like.

A name:

* can contain **numbers & letters**
* should be **lowercase**
* spaces-should-have-**dashes**-if-you-need-them

If `name` does not exist, the default will be the name of the directory. 

## defaults

Default configuration settings which may be used by your commands and overridden by end users.

```toml
[defaults]
semicolons = true
colorTheme = ['red', 'no', 'blue', 'aaaaaaaaa']
```


## 3rd Party Modules Available

module                                                  | purpose
--------------------------------------------------------|-------------------------
[enquirer](https://github.com/enquirer/enquirer)        | prompts & user input
[fs-jetpack](https://github.com/szwacz/fs-jetpack)      | files & folders
[ejs](https://github.com/mde/ejs)                       | templates
[apisauce](https://github.com/skellock/apisauce)        | http requests
[lodash](https://github.com/lodash/lodash)              | utilities
[colors](https://github.com/Marak/colors.js)            | colors in your terminal
[ascii-table](https://github.com/sorensen/ascii-table)  | tables in your terminal
[ramda](https://github.com/ramda/ramda)                 | functional utilities
[ramdasauce](https://github.com/skellock/ramdasauce)    | functional utilities

## Including Modules

> TODO: verify that this can be done.
