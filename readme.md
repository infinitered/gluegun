# gluegun

The `gluegun` **CLI** offers a low-friction way to add code generation & other automation to your projects.

The `gluegun` **library** is a toolkit for building your own `gluegun`-like CLIs.

It uses Node.js 7 with `--harmony` for `async`/`await` syntax.

> Under heavy construction! We're just getting started. If you have any questions, feel free to file an issue!


## Why?

`gluegun` wiggles it's butt into that spot between DIY scripts & full-featured monsters like Yeoman.

Once installed (`npm install -g gluegun`) you've got everything you need to start making plugins. 

Plugins are easy as dropping a JavaScript file in one of several directories (depending on what you need).  No `node_modules` unless you need them.

## Quick Start - Install

```sh
# install globally
npm install -g gluegun

# now you can run it
gluegun
```

## Quick Start - Create A Plugin

Make a directory for personal plugins:
```sh
mkdir -p ~/.gluegun/plugins/helloworld
cd ~/.gluegun/plugins/helloworld
```
Then, make a config file:
```sh
touch gluegun.toml
echo "description = 'My first plugin'" >> gluegun.toml
```

Finally, make a command:
```sh
mkdir commands
touch commands/yay.js
echo "module.exports = async function (context) {" >> commands/yay.js
echo "  context.print.success('sweet!')" >> commands/yay.js
echo "}" >> commands/yay.js
```

# run that command
```sh
gluegun helloworld yay
```


## Do I need it?

Depends on how many checkboxes you fill. I need to:

* [ ] generate files from templates
* [ ] move files and directories around
* [ ] execute other scripts
* [ ] interact with API servers
* [ ] have my own users write plugins
* [ ] install 3rd-party plugins from github 
* [ ] support command line arguments and options
* [ ] have user interactions like auto-complete prompts
* [ ] print pretty colors and tables

The more checks in that list, the more compelling to check it out.


### BYOB: Bring Your Own Branding

Libraries like this shouldn't be the star. This is just glue. What you're making is the real MVP. So `gluegun` is completely brandable.

If your needs are fairly common, it can be something simple like adding this to your `package.json`. 

```json
{
  "name": "wheel",
  "version": "2.0",
  "bin": {
    "wheel": "./node_modules/.bin/gluegun --gluegun-brand wheel"
  },
  "dependencies": {
    "gluegun": "x.y.z"
  }
}
```

Or you can create your roll your own entry point and `require` only the gluegun runtime features you need.

```js
// bring in gluegun
const { Runtime } = require('gluegun')

// make an async function for your CLI
async function movieQuotes () {
  // create a runtime environment so we can type:
  //
  // $ movie
  const runtime = new Runtime('movie')

  // load a plugin so we can type:
  //
  // $ movie quotes
  runtime.loadPlugin(`${__dirname}/quotes`)

  // if inside the `${__dirname}/quotes/commands/` directory
  // we had a few files:
  //
  //   update.js
  //   random.js
  // 
  // we can type:
  // 
  // $ movie quotes update
  // $ movie quotes random
  // $ movie quotes random --title "Kingpin" --json

  // kick off the run... without any parameters, this will
  // parse everything it needs from the command line.
  await runtime.run()

  // or call with parameters if you've got your own way of handling things...
  //
  await runtime.run({
    pluginName: 'quotes',
    arguments: 'random',
    options: { title: 'Kingpin', json: true }
  })
}
```

### People Using Gluegun [SOON]

Who's gluing apps together with gluegun?  You can see this tool in action with 
the following victims... technologies.

* [Reactotron](https://github.com/reactotron/reactotron) - App for React App Inspection
* [Ignite](https://github.com/infinitered/ignite) - React Native Headstarter
* ...next?

### Documentation

* [Context API](./docs/context-api.md)
* [Runtime API](./docs/runtime-api.md)
* [Contributing](./docs/contributing.md)
