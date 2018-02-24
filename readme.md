[![npm module](https://badge.fury.io/js/gluegun.svg)](https://www.npmjs.org/package/gluegun)
[![All Contributors](https://img.shields.io/badge/all_contributors-8-orange.svg?style=flat-square)](#contributors)
[![Build Status](https://semaphoreci.com/api/v1/ir/gluegun/branches/master/shields_badge.svg)](https://semaphoreci.com/ir/gluegun)
[![Coverage Status](https://coveralls.io/repos/github/infinitered/gluegun/badge.svg?branch=master)](https://coveralls.io/github/infinitered/gluegun?branch=master)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Chat about GlueGun in the IR Community](https://infiniteredcommunity.herokuapp.com/badge.svg)](https://community.infinite.red/)

# gluegun

`gluegun` is a lightweight toolkit for building command-line interfaces (CLIs),
with support for:

🌯 *parameters* - command line arguments and options<br />
🎛 *template* - generating files from templates<br />
🗄 *patching* - manipulating file contents<br />
💾 *filesystem* - moving files and directories around<br />
⚒ *system* - executing other command-line scripts<br />
🎅 *http* - interacting with API servers<br />
🛎 *prompt* - auto-complete prompts<br />
💃 *print* - printing pretty colors and tables<br />
👩‍✈️ *semver* - working with semantic versioning<br />
🎻 *strings* - manipulating strings & template data<br />

In addition, `gluegun` supports expanding your CLI's ecosystem with a robust set
of easy-to-write plugins and extensions.

# Yeah, But Why?

If you want to have **your** CLI...

* get built quickly
* have plugin support
* but skip the boring parts of developing it
* and avoid large CLI libraries that want to take over your world

... welcome!

# Quick Start

Just run the `gluegun` CLI like this:

```
$ npm install -g gluegun@next
$ gluegun new movies
$ cd movies
$ npm install
$ npm link
$ movies help
```

You should see your new CLI help. Open the folder in your favorite editor and
start building your CLI!

_Tip: If you want your CLI to use TypeScript, pass in `--typescript`_

# Code

Let's start with what a `gluegun` CLI looks like.

```js
// in movie/src/cli.js...

// ready
const { build } = require('gluegun')

// aim
const movieCLI = build('movie')
  .src(`${__dirname}/core-plugins`)
  .plugins('node_modules', { matching: 'movie-*' })
  .help()
  .version()
  .defaultCommand()
  .create()

// fire!
movieCLI.run()
```

**Commands**

Commands are simple objects that provide a name, optional aliases, and a function to run.

```js
// in movie/commands/foo.js
module.exports = {
  name: 'foo',
  alias: 'f',
  run: async function(toolbox) {
    // gluegun provides all these features and more!
    const { system, print, filesystem, strings } = toolbox

    // ...and be the CLI you wish to see in the world
    const awesome = strings.trim(system.run('whoami'))
    const moreAwesome = strings.kebabCase(`${awesome} and a keyboard`)
    const contents = `🚨 Warning! ${moreAwesome} coming thru! 🚨`
    const home = process.env['HOME']
    filesystem.write(`${home}/realtalk.json`, { contents })

    print.info(`${print.checkmark} Citius`)
    print.warning(`${print.checkmark} Altius`)
    print.success(`${print.checkmark} Fortius`)
  }
}
```

See the [toolbox api docs](./docs/toolbox-api.md) for more details on what you can do.

See the [runtime docs](./docs/runtime.md) for more details on building your own CLI and join us in the #gluegun channel of the Infinite Red Community Slack ([community.infinite.red](http://community.infinite.red)) to get friendly help!

# Who Is Using This?

* [Ignite](https://github.com/infinitered/ignite) - React Native Starter Kit
* [Solidarity](https://github.com/infinitered/solidarity) - audits your system dependencies so you can develop in peace
* AppMachine - closed source for now (still building) - tool for helping code generate apps

# What's under the hood?

We've assembled an _all star cast_ of libraries to help you build your CLI.

⭐️ [ejs](https://github.com/mde/ejs) for templating<br />
⭐️ [semver](https://github.com/npm/node-semver) for version investigations<br />
⭐️ [fs-jetpack](https://github.com/szwacz/fs-jetpack) for the filesystem<br />
⭐️ [yargs-parser](https://github.com/yargs/yargs-parser), [enquirer](https://github.com/enquirer/enquirer), [colors](https://github.com/Marak/colors.js), [ora](https://github.com/sindresorhus/ora) and [cli-table2](https://github.com/jamestalmage/cli-table2) for the command line<br />
⭐️ [axios](https://github.com/mzabriskie/axios) & [apisauce](https://github.com/skellock/apisauce) for web & apis<br />
⭐️ [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) for flexible configuration </br>
⭐️ [cross-spawn](https://github.com/IndigoUnited/node-cross-spawn) for running sub-commands</br>
⭐️ [execa](https://github.com/sindresorhus/execa) for running more sub-commands</br>
⭐️ [node-which](https://github.com/npm/node-which) for finding executables</br>
⭐️ [pluralize](https://github.com/blakeembrey/pluralize) for manipulating strings</br>

Node [Node.js 7.6+](https://nodejs.org) is required.

## Sponsors

[Gluegun](https://github.com/infinitered/gluegun) is sponsored by [Infinite Red](https://infinite.red/), a premium custom mobile app and web design and development agency. We are a team of designers and developers distributed across the USA and based out of Portland, Oregon and the San Francisco Bay Area. Our specialties are UI/UX design, React Native, React, and Elixir. Email [hello@infinite.red](mailto:hello@infinite.red) if you'd like to talk about your project!
