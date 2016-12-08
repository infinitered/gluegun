# Creating Plugins

A plugin are set of functions & templates which extends the `gluegun` 
environment. These extensions generally have a theme such as 
**react native**, **fastlane**, or even just **my sandbox**.

# Directory Structure

A plugin is a directory.

A `gluegun` plugin generally has 4 things.

path          | purpose
--------------|-------------------
/gluegun.toml | the plugin's configuration file
/commands     | the scripts that people will run from the command line
/extensions   | features that you can make available to scripts
/templates    | used to code generate files

And generally a configuration file:

`gluegun.toml`


`commands` and `extensions` contain plain NodeJS JavaScript files.  Files located in these
directories will be automatically loaded and made available.

At the top of these `*.js` files you have the ability to customize some meta data.

For example, you might have a command called `commands/say.js` that looks like this:

```js
// @command     say
// @description This command will say the word you tell it to.
module.exports = async function (context) {
  const { print, parameters } = context  
  print.info(`hello ${parameters.first}`)
}
```

This `@command` and the `@description` will be detected and will populate the information that
the user sees when they ask for help or a list of commands.

Extensions are similar.

```js
// @extension   appstore
// @description Finds out information about the products on the AppStore.

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

## namespace

The namespace is a prefix to your commands.

```toml
namespace = 'something'
```

Since many plugins can be installed, we namespace them. If you're creating plugins
for others to use, try to be very specific about the name. Naming it after a project
is a good idea (e.g. `ignite` or `reactotron`). Calling it `dev` or `internet` is
probably asking for trouble.

If you're just making plugins for your project, then please, feel free to call it
whatever you'd like.

A namespace:

* can contain **numbers & letters**
* should be **lowercase**
* spaces-should-have-**dashes**-if-you-need-them

If `namespace` does not exist, the default will be the name of the directory. 

## defaults

Default configuration settings which may be used by your commands and overridden by end users.

```toml
[defaults]
semicolons = true
colorTheme = ['red', 'no', 'blue', 'aaaaaaaaa']
```


## 3rd Party Modules Available

| module     | purpose              |
|------------|----------------------|
| [inquirer.js](https://github.com/SBoudrias/Inquirer.js) | prompts & user input |
| [fs-jetpack](https://github.com/szwacz/fs-jetpack)      | files & folders |
| [nunjucks](https://github.com/mozilla/nunjucks)         | templates |
| [cross-env](https://github.com/kentcdodds/cross-env)    | executing programs |
| [apisauce](https://github.com/skellock/apisauce)        | http requests |
| [lodash](https://github.com/lodash/lodash)              | utilities |
| [colors](https://github.com/Marak/colors.js)            | colors in your terminal |
| [ascii-table](https://github.com/sorensen/ascii-table)  | tables in your terminal |
| [ramda](https://github.com/ramda/ramda)                 | functional utilities |
| [ramdasauce](https://github.com/skellock/ramdasauce)    | functional utilities |

## Including Modules

> TODO: verify that this can be done.
