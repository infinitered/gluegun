# Making a plugin for your Gluegun-powered CLI

Gluegun is a powerful CLI toolbox, but if you want to know what really sets it apart, it's the plugin system. While Commander and Yeoman and other CLI systems have plugin concepts, with gluegun we treat them as first-class citizens.

Let's walk through creating a plugin for a CLI. We'll then use this plugin in a project where we're using this CLI.

_Note: if you're experiencing any issues in the tutorial, feel free to let us know in the [IR Community Slack](https://community.infinite.red)_. We want this to work really smoothly!

## Step 1: Our CLI

We're building out a CLI that prints out system information, called `intern`. Let's spin this up:

```bash
$ yarn global add gluegun
$ gluegun new intern --javascript
$ cd intern
$ yarn
$ yarn link
$ cd ..
$ intern help
```

You should see the baked-in help for our new CLI. Yay!

## Step 2: Create the basic plugin structure

Let's create a plugin that we would use to show system information for macOS. It'll be called `intern-macos`.

NOTE: This is the naming scheme we recommend for gluegun-powered plugins -- put the name of your CLI, a dash, and then the name of your plugin. Examples: `ignite-i18n`, `solidarity-react-native`. We support this naming scheme right out of the box, in fact!

```bash
$ mkdir intern-macos
$ cd intern-macos
$ yarn init
```

At this point, go through yarn's init. It doesn't matter too much what you put here. I just hit enter on everything.

Lastly, add a `commands` and an `extensions` folder. Note that with new versions of Gluegun, you can also use a build pipeline and include your commands and extensions in `build/commands` and `build/extensions` and Gluegun will still find them.

```bash
$ mkdir commands extensions
```

## Step 3: Create a command

We're going to make a command that we'll invoke with `intern macos` which will display the version of macOS we're currently running.

```bash
$ touch commands/macos.js
```

Open this file, and put the following:

```js
module.exports = {
  name: 'macos',
  alias: 'osx',
  run: async ({ system, print }) => {
    const osInfo = await system.run(`defaults read loginwindow SystemVersionStampAsString`)
    print.info(osInfo)
  },
}
```

## Step 4: Create an extension

While the above is a simple command, if the logic started getting more complex, we'd probably want to move it into an extension. Let's do that here.

In `extensions`, create a new file called `macos-extension.js`:

```bash
$ touch extensions/macos-extension.js
```

Edit this file like so:

```js
module.exports = toolbox => {
  toolbox.internMac = async () => {
    return await toolbox.system.run(`defaults read loginwindow SystemVersionStampAsString`)
  }
}
```

This adds a new property to gluegun's awesome `toolbox` object, called `internMac`, which is a function that returns the info we need. Since all extensions are loaded automatically, it's available in our command, so let's use it in `commands/macos.js`:

```js
module.exports = {
  name: 'macos',
  alias: 'osx',
  run: async ({ print, internMac }) => print.info(await internMac()),
}
```

## Step 5: Make a new project

Let's try this out!

```bash
cd ..
mkdir my-project
cd my-project
yarn init
yarn add ../intern-macos
```

Note that we're referencing the plugin from a folder, because we haven't published it to NPM yet. If we have, we'd use `yarn add intern-macos` like you'd expect.

Now let's kick off our plugin command:

```bash
$ intern macos
10.13.1
```

Let's try the alias:

```bash
$ intern macos osx
10.13.1
```

Yay!

## Step 6: Publish to NPM

You can learn how to publish an NPM package here: [https://docs.npmjs.com/getting-started/publishing-npm-packages](https://docs.npmjs.com/getting-started/publishing-npm-packages)

Once it's published, you can add your new plugin to your project:

```bash
$ yarn add intern-macos
```

After that, the new command should be available on your project like we explored above.

_Still have questions? Let us know in the [IR Community Slack](https://community.infinite.red)._

If you'd like to learn more about what plugins are, check out the [plugins documentation](./plugins.md).
