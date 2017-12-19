# Inside Context

So you're making a command. Let's get started.

```js
module.exports = {
  name: 'dostuff',
  alias: 'd',
  run: async function(context) {
    // great! now what?
  },
}
```

Here's what's available inside the `context` object you see all over Gluegun.

| name           | provides the...                                    | 3rd party                      |
| -------------- | -------------------------------------------------- | ------------------------------ |
| **meta**       | information about the currently running CLI        |                                |
| **config**     | configuration options from the app or plugin       |                                |
| **filesystem** | ability to copy, move & delete files & directories | fs-jetpack                     |
| **http**       | ability to talk to the web                         | apisauce                       |
| **parameters** | command line arguments and options                 | yargs-parser                   |
| **patching**   | manipulating file contents easily                  | fs-jetpack                     |
| **print**      | tools to print output to the command line          | colors, ora                    |
| **prompt**     | tools to acquire extra command line user input     | enquirer                       |
| **semver**     | utilities for working with semantic versioning     | semver                         |
| **strings**    | some string helpers like case conversion, etc.     | lodash & ramda                 |
| **system**     | ability to execute                                 | node-which, execa, cross-spawn |
| **template**   | code generation from templates                     | ejs                            |

Think of `context` as a toolbox full of useful tools for building CLIs. For example, the `context.version` function can be invoked like this:

```js
module.exports = {
  name: 'dostuff',
  alias: 'd',
  run: async function(context) {
    // use them like this...
    context.print.info(context.meta.version())

    // or destructure!
    const { print: { info }, meta: { version } } = context
    info(version())
  },
}
```

To learn more about each tool, explore the rest of the `context-*.md` files in this folder.
