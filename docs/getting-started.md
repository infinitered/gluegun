# Getting Started

The fastest way to get started is to use the built-in Gluegun CLI (very meta!) to generate it.

## Creating a new Gluegun-powered CLI

Gluegun works on macOS, Linux, and Windows 10. First, ensure you have Node installed and that you can access it (minimum version 7.6):

```
$ node --version
```

Install `gluegun` globally.

```
$ npm install -g gluegun
```

Next, navigate to the folder you'd like to create your CLI in and generate it.

```
$ gluegun new mycli
```

If you want TypeScript, use `--typescript`:

```
$ gluegun new mycli --typescript
```

_Note: We recommend TypeScript, but you don't have to use it!_

## Linking your CLI so you can access it

Navigate to the new `mycli` folder and run `npm link` to have it available globally on your command line.

```
$ cd mycli
$ npm link
$ mycli --help
```

## Creating your first command

Your Gluegun-powered CLI isn't very useful without a command! In your CLI, create a new JS file in `src/commands` called `hello.js`. In that file, add this:

```js
// src/commands/hello.js
module.exports = {
  run: toolbox => {
    toolbox.print.info('Hello, world!')
  },
}
```

Now run your command:

```
$ mycli hello
Hello, world!
```

Yay!

## Creating your first extension

You can add more tools into the `toolbox` for _all_ of your commands to use by creating an `extension`. In your `mycli` folder, add a new file in `src/extensions` called `hello-extension.js`. (It doesn't _have_ to end in `-extension`, but that's a convention.)

```js
// src/extensions/hello-extension.js
module.exports = toolbox => {
  toolbox.hello = () => {
    toolbox.print.info('Hello from an extension!')
  }
}
```

Then, in your `hello` command, use that function instead:

```js
// src/commands/hello.js
module.exports = {
  run: toolbox => {
    toolbox.hello()
  },
}
```

When you run the command, this time it'll use the extension's output.

```
$ mycli hello
Hello from an extension!
```

## Next steps

There are _many_ more tools in the toolbox than just `print.info`. You can generate from a template, manipulate files, hit API endpoints via HTTP, access parameters, run system commands, ask for user input, and much more. Explore the API docs in the sidebar to learn more or follow a tutorial like [Making a Movie CLI](/tutorial-making-a-movie-cli).
