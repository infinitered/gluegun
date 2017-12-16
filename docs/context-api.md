# Inside Context

So you're making a plugin. Let's get started.

```js
module.exports = async function(context) {
  // great! now what?
}
```

Here's what's available inside `context` object.

| name           | provides the...                                    | 3rd party                      |
| -------------- | -------------------------------------------------- | ------------------------------ |
| **config**     | configuration options from the app or plugin       |
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

If this is starting to sound like a scripting language, then good. That's exactly how to think of it. Except
we're not inventing another language. And we're still running in a `node.js` environment, so you can do whatever you want.
