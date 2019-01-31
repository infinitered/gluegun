# Getting Started

The fastest way to get started is to use the built-in Gluegun CLI (very meta!) to generate it.

## Creating a new Gluegun-powered CLI

Gluegun works on macOS, Linux, and Windows 10. First, ensure you have Node installed and that you can access it (minimum version 7.6):

```
$ node --version
```

We will also be using [yarn](https://yarnpkg.com/) in this guide rather than `npm`. You can use `npm` if you want.

Install `gluegun` globally.

```
$ yarn global add gluegun
```

Next, navigate to the folder you'd like to create your CLI in and generate it.

```
$ gluegun new mycli
```

Gluegun will ask if you want to use TypeScript or modern JavaScript:

```
? Which language would you like to use? (Use arrow keys)
  TypeScript - Gives you a build pipeline out of the box (default)
  Modern JavaScript - Node 8.2+ and ES2016+ (https://node.green/)
```

You can also pass in `--typescript` or `--javascript` (or `-t` or `-j` for short) to bypass the prompt:

```
$ gluegun new mycli -t
$ gluegun new mycli -j
```

_Note: We recommend TypeScript, but you don't have to use it! Gluegun works great with modern JavaScript._

## Linking your CLI so you can access it

Navigate to the new `mycli` folder and run `yarn link` to have it available globally on your command line.

```
$ cd mycli
$ yarn link
$ mycli --help
```

## Creating your first command

Your Gluegun-powered CLI isn't very useful without a command! In your CLI, create a new JS file in `src/commands` called `hello.js`. In that file, add this:

```js
// src/commands/hello.js
module.exports = {
  run: async toolbox => {
    toolbox.print.info('Hello, world!')
  },
}
```

For TypeScript, it's not much different:

```typescript
// src/commands/hello.ts
import { GluegunToolbox } from 'gluegun'
module.exports = {
  run: async (toolbox: GluegunToolbox) => {
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
module.exports = async toolbox => {
  toolbox.hello = () => {
    toolbox.print.info('Hello from an extension!')
  }
}
```

Or TypeScript:

```typescript
// src/extensions/hello-extension.ts
import { GluegunToolbox } from 'gluegun'
module.exports = async (toolbox: GluegunToolbox) => {
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
    const { hello } = toolbox

    hello()
  },
}
```

When you run the command, this time it'll use the extension's output.

```
$ mycli hello
Hello from an extension!
```

Note that we sometimes call the `toolbox` the `context` or the `RunContext`. That's just another word for the same thing.

## Next steps

There are _many_ more tools in the toolbox than just `print.info`. You can generate from a template, manipulate files, hit API endpoints via HTTP, access parameters, run system commands, ask for user input, and much more. Explore the [API docs](./toolbox-api.md) in this folder to learn more or follow a tutorial like [Making a Movie CLI](./tutorial-making-a-movie-cli.md).
