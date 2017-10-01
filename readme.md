[![npm module](https://badge.fury.io/js/gluegun.svg)](https://www.npmjs.org/package/gluegun)
[![Build Status](https://semaphoreci.com/api/v1/ir/gluegun/branches/master/shields_badge.svg)](https://semaphoreci.com/ir/gluegun)
[![Coverage Status](https://coveralls.io/repos/github/infinitered/gluegun/badge.svg?branch=master)](https://coveralls.io/github/infinitered/gluegun?branch=master)
[![Chat about GlueGun in the IR Community](https://infiniteredcommunity.herokuapp.com/badge.svg)](https://community.infinite.red/)

# gluegun

`gluegun` is a toolkit for building CLIs.

We assembled an **all-star cast** of *outstanding* & focused libraries, added a plugin layer, then wrapped it up in an easy-to-use and easy-to-bust-out-of API.

⭐️ [ejs](https://github.com/mde/ejs) for templating<br />
⭐️ [semver](https://github.com/npm/node-semver) for version investigations<br />
⭐️ [fs-jetpack](https://github.com/szwacz/fs-jetpack) for the filesystem<br />
⭐️ [minimist](https://github.com/substack/minimist), [enquirer](https://github.com/enquirer/enquirer), [colors](https://github.com/Marak/colors.js), [ora](https://github.com/sindresorhus/ora) and [ascii-table](https://github.com/sorensen/ascii-table) for the command line<br />
⭐️ [axios](https://github.com/mzabriskie/axios) & [apisauce](https://github.com/skellock/apisauce) for web & apis<br />
⭐️ [toml](https://github.com/BinaryMuse/toml-node) for human-friendly config files </br>
⭐️ [cross-spawn](https://github.com/IndigoUnited/node-cross-spawn) for running sub-commands</br>
⭐️ [execa](https://github.com/sindresorhus/execa) for running more sub-commands</br>
⭐️ [node-which](https://github.com/npm/node-which) for finding executables</br>

Node [Node.js 7.6+](https://nodejs.org) is required.

> Captain F. Disclosure Says...
>
> 1.0 is now shipping!  2.0 is close behind it and that is what you're seeing in `master`. If you're up for contributions, make sure you're using this branch. :tada:

# Ya, But Why?

Libraries like this shouldn't be the star. This is just glue. What you're building is important thing. So `gluegun` aims to plug into YOUR code, not vice versa.

If you want to make **your** CLI...

* get built quickly
* have plugin support
* but skip the boring parts of developing it

... welcome!

# Do I need it?

`gluegun` wiggles it's butt into that spot between DIY scripts & full-featured monsters like [Yeoman](http://yeoman.io).

Here's the highlights:

🎛 generate files from templates</br>
💾 move files and directories around</br>
🔮 generate files from templates</br>
⚒ execute other scripts</br>
🎅 interact with API servers</br>
🔌 have my own users write plugins</br>
🌯 support command line arguments and options</br>
🛎 have user interactions like auto-complete prompts</br>
💃 print pretty colors and tables</br>

We picked these features because they're gloriously generic.  Most CLIs could use more than a few in this list. And if it's this easy. Why not, right?

# Code

Let's start with what you or your end user will be writing.

**Plugins**

```js
module.exports = async function (context) {
  // grab a fist-full of features...
  const { system, print, filesystem, strings } = context
  const { trim, kebabCase } = strings
  const { info, warning, success, checkmark } = print

  // ...and be the CLI you wish to see in the world
  const awesome = trim(system.run('whoami'))
  const moreAwesome = kebabCase(`${awesome} and a keyboard`)
  const contents = `🚨 Warning! ${moreAwesome} coming thru! 🚨`
  const home = process.env['HOME']
  filesystem.write(`${home}/realtalk.json`, { contents })

  info(`${checkmark} Citius`)
  warning(`${checkmark} Altius`)
  success(`${checkmark} Fortius`)
}
```
See the [context api docs](./docs/context-api.md) for more details on what you can do.

And what about the CLI you make? Depending on the features you want, more or less:

```js
// ready
const { build } = require('gluegun')

// aim
const runtime = build()
  .brand('movie')
  .configFile('./movie.toml')
  .src(`${__dirname}/core-plugins`)
  .plugin('~/Desktop/movie/quote')
  .plugin('~/Desktop/movie/credits')
  .plugins('node_modules', { matching: 'movie-*' })
  .create()

// fire!
runtime.run()
```

See the [runtime docs](./docs/runtime.md) for more details on building your own CLI and join us in the #gluegun channel of the Infinite Red Community Slack ([community.infinite.red](http://community.infinite.red)) to get friendly help!

# Who Is Using This?

* [Ignite](https://github.com/infinitered/ignite) - React Native Headstarter
* [Solidarity](https://github.com/infinitered/solidarity) - audits your system dependencies so you can develop in peace
* AppMachine - closed source for now (still building) - tool for helping code generate apps

## Premium Support

[gluegun](https://github.com/infinitered/gluegun), as open source projects, is free to use and always will be. [Infinite Red](https://infinite.red/) offers premium gluegun support and general mobile app design/development services. Email us at [hello@infinite.red](mailto:hello@infinite.red) to get in touch with us for more details.
