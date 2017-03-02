[![npm module](https://badge.fury.io/js/gluegun.svg)](https://www.npmjs.org/package/gluegun)
[![Slackin](https://infiniteredcommunity.herokuapp.com/badge.svg)](https://infiniteredcommunity.herokuapp.com/)

`gluegun` is a toolkit for building CLIs with plugin support.

We assembled an **all-star cast** of *outstanding* libraries, added a plugin layer, then wrapped it up in an ease-to-use and ease-to-bust-out-of API.

⭐️ [ejs](https://github.com/mde/ejs) for templating<br />
⭐️ [fs-jetpack](https://github.com/szwacz/fs-jetpack) for the filesystem<br />
⭐️ [shelljs](https://github.com/shelljs/shelljs) for a few cross-platform system utils<br />
⭐️ [minimist](https://github.com/substack/minimist), [enquirer](https://github.com/enquirer/enquirer), [colors](https://github.com/Marak/colors.js), [ora](https://github.com/sindresorhus/ora) and [ascii-table](https://github.com/sorensen/ascii-table) for the command line<br />
⭐️ [axios](https://github.com/mzabriskie/axios) & [apisauce](https://github.com/skellock/apisauce) for web & apis<br />
⭐️ both [lodash](https://github.com/lodash/lodash) AND [ramda](https://github.com/ramda/ramda) + [ramdasauce](https://github.com/skellock/ramdasauce) for quality of life<br />
⭐️ [toml](https://github.com/BinaryMuse/toml-node) for human-friendly config files </br>
⭐️ [clipboardy](https://github.com/sindresorhus/clipboardy) brings the copy and the *paste*<br />
</br>
It uses [Node.js 7](https://nodejs.org) with `--harmony` for `async`/`await` syntax.

## Why not just use ... ?

Libraries like this shouldn't be the star. This is just glue.  What you're building is important thing. So `gluegun` aims to plug into YOUR code, not vice versa.

If you want to make **your** CLI...

* get built quickly
* have plugin support
* but skip the boring parts of developing it

... welcome!

!> **Captain F. Disclosure Says**... We're just still wrapping up things here. If you have any questions, feel free to file an issue! [Contributing?](./docs/contributing.md)

## Do I need it?

`gluegun` wiggles it's butt into that spot between DIY scripts & full-featured monsters like [Yeoman](http://yeoman.io).

Here's the highlights

🎛 &nbsp; generate files from templates
<br />💾 &nbsp; move files and directories around
<br />🔮 &nbsp; generate files from templates
<br />⚒ &nbsp; execute other scripts
<br />🎅 &nbsp; interact with API servers
<br />🔌 &nbsp; have my own users write plugins
<br />🌯 &nbsp; support command line arguments and options
<br />🛎 &nbsp; have user interactions like auto-complete prompts
<br />💃 &nbsp; print pretty colors and tables

We picked these features because they're gloriously generic.  Most CLIs could use more than a few in this list. And if it's this easy. Why not, right?

## What does it look like?

Let's start with what you or your end user will be writing.

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
See the [context api docs](/context-api.md) for more details on what you can do.

See the [runtime docs](/runtime.md) for more details on building your own CLI.

# Who is using this?

Who's gluing CLIs together with gluegun?

* [Ignite](https://github.com/infinitered/ignite) - React Native boilerplate


