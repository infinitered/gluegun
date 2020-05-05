[![npm module](https://badge.fury.io/js/gluegun.svg)](https://www.npmjs.org/package/gluegun)
[![CircleCI](https://circleci.com/gh/infinitered/gluegun.svg?style=svg)](https://circleci.com/gh/infinitered/gluegun)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Gluegun

![gluegun](https://user-images.githubusercontent.com/1479215/50237287-5a23e380-0371-11e9-89ea-85b41cd25217.jpg)

Gluegun is a delightful toolkit for building Node-based command-line interfaces (CLIs) in TypeScript or modern JavaScript, with support for:

🌯 *parameters* - command-line arguments and options<br />
🎛 *template* - generating files from templates<br />
🗄 *patching* - manipulating file contents<br />
💾 *filesystem* - moving files and directories around<br />
⚒ *system* - executing other command-line scripts<br />
🎅 *http* - interacting with API servers<br />
🛎 *prompt* - auto-complete prompts<br />
💃 *print* - printing pretty colors and tables<br />
👩‍✈️ *semver* - working with semantic versioning<br />
🎻 *strings* - manipulating strings & template data<br />
📦 *packageManager* - installing NPM packages with Yarn or NPM<br />

In addition, `gluegun` supports expanding your CLI's ecosystem with a robust set of easy-to-write plugins and extensions.

# Why use Gluegun?

You might want to use Gluegun if:

* You need to build a CLI app
* You want to have powerful tools at your fingertips
* And you don't want to give up flexibility at the same time

If so ... welcome!

# Quick Start

Just run the `gluegun` CLI like this:

```
# spin up your new CLI
npx gluegun new movies

# choose TypeScript or Modern JavaScript
# now jump into the source
cd movies

# and link your new executable
yarn link

# and run it!
movies help
```

You should see your new CLI help. Open the folder in your favorite editor and start building your CLI!

# Code

Let's start with what a `gluegun` CLI looks like.

```js
// in movie/src/cli.[js|ts]...

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
// in movie/src/commands/foo.js
module.exports = {
  name: 'foo',
  alias: 'f',
  run: async function(toolbox) {
    // gluegun provides all these features and more!
    const { system, print, filesystem, strings } = toolbox

    // ...and be the CLI you wish to see in the world
    const awesome = strings.trim(await system.run('whoami'))
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

* [Ignite CLI](https://github.com/infinitered/ignite) - React Native CLI and starter kit
* [Solidarity](https://github.com/infinitered/solidarity) - audits your system dependencies so you can develop in peace
* [AWS Amplify CLI](https://github.com/aws-amplify/amplify-cli) - A CLI toolchain for simplifying serverless web and mobile development
* [Sara Vieira's Fiddly](https://github.com/SaraVieira/fiddly) - Create beautiful and simple HTML pages from your Readme.md files - [https://fiddly.netlify.com](https://fiddly.netlify.com)
* [Graph CLI](https://github.com/graphprotocol/graph-cli) - CLI for building and managing subgraphs that index data from Ethereum and IPFS - [https://thegraph.com/explorer](https://thegraph.com/explorer)
* [Vts](https://github.com/snowfrogdev/Vts) - Vanilla TypeScript library starter CLI tool

# What's under the hood?

We've assembled an _all-star cast_ of libraries to help you build your CLI.

⭐️ [ejs](https://github.com/mde/ejs) for templating<br />
⭐️ [semver](https://github.com/npm/node-semver) for version investigations<br />
⭐️ [fs-jetpack](https://github.com/szwacz/fs-jetpack) for the filesystem<br />
⭐️ [yargs-parser](https://github.com/yargs/yargs-parser), [enquirer](https://github.com/enquirer/enquirer), [colors](https://github.com/Marak/colors.js), [ora](https://github.com/sindresorhus/ora) and [cli-table3](https://github.com/cli-table/cli-table3) for the command line<br />
⭐️ [axios](https://github.com/mzabriskie/axios) & [apisauce](https://github.com/infinitered/apisauce) for web & apis<br />
⭐️ [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) for flexible configuration </br>
⭐️ [cross-spawn](https://github.com/IndigoUnited/node-cross-spawn) for running sub-commands</br>
⭐️ [execa](https://github.com/sindresorhus/execa) for running more sub-commands</br>
⭐️ [node-which](https://github.com/npm/node-which) for finding executables</br>
⭐️ [pluralize](https://github.com/blakeembrey/pluralize) for manipulating strings</br>

[Node.js 8.0+](https://nodejs.org) is required. If you need to support Node 7.6, use Gluegun 3.x.

## Community CLIs and Plugins

Here are a few community CLIs based on Gluegun plus some plugins you can use. Is yours missing? Send a PR to add it!

* [Gluegun-Menu](https://github.com/lenneTech/gluegun-menu) - A command menu for Gluegun-based CLIs
* [Gluegun CLI-Starter](https://github.com/lenneTech/cli-starter) - A CLI Starter for your next Gluegun CLI project

## Sponsors

[Gluegun](https://github.com/infinitered/gluegun) is sponsored by [Infinite Red](https://infinite.red/), a premium custom mobile app and web design and development agency. We are a team of designers and developers distributed across the USA and based near Portland, Oregon. Our specialties are UI/UX design, React and React Native, Node, and more. Email [hello@infinite.red](mailto:hello@infinite.red) if you'd like to talk about your project!
