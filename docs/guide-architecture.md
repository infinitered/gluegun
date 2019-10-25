# Guide: Architecting Your Gluegun CLI

There are many ways to architect Gluegun-powered CLIs. This guide is intended to be a living document, collecting the lessons learned along the way of building CLIs with Gluegun. It is not necessarily the only correct way to build a CLI.

If you have ideas, suggestions, or questions, feel free to [open an issue](https://github.com/infinitered/gluegun/issues/new)!

## Commands

Commands should be focused on user interaction and not necessarily on implementation details. Don't write your whole app inside a command; instead, parse out user-provided info, then delegate to other functions (which can be provided via extensions, which are described below) to do work.

_Do this_

```js
module.exports = {
  name: 'world',
  alias: ['w', 'earth'],
  run: async toolbox => {
    // in this case, `hello` is provided by an extension
    const { hello, prompt } = toolbox

    // user interaction is great in a command
    const isEarthling = await prompt.confirm('Are you an earthling?')

    // delegate the actual work to an extension
    if (isEarthling) {
      hello.greetEarthling()
    } else {
      hello.greetAlien()
    }
  },
}
```

### Commands file structure

Nest commands in a folder structure that mirrors their command line equivalent. Unlike other libraries, we don't use `index.js` for the default command in a folder. Instead, use the same name as the folder. This helps avoid the situation where you might have 12 `index.js` files open in your editor, which is confusing.

For example:

_Don't do this_

```
commands
  hello
    index.js
```

_Do this_

```
commands
  hello
    hello.js
```

_Or this_

```
commands
  hello.js
```

If you have nested commands, keep them all in the folder, like this:

```
commands
  hello
    hello.js
    world.js
```

You don't have to have a default command for a folder. Gluegun will pick up on it (as of 2.0.0-beta.7).

```
commands
  hello
    world.js
```

As of Gluegun 4.1.0, you can also nest commands in a `build` folder, if for example you're using TypeScript and want to compile to `./build`.

## Extensions

Think of extensions as "drawers" full of tools in your Gluegun toolbox. In the above example, the `hello` extension adds two functions, `greetEarthling` and `greetAlien`.

```js
module.exports = toolbox => {
  const { print } = toolbox
  toolbox.hello = {
    greetEarthling: () => print.info('Hello, earthling!'),
    greetAlien: () => print.info('Greetings, alien!'),
  }
}
```

_Hint: In most cases, you probably don't want to use `prompt` in your extensions. They should be more general purpose tools and not specific user flows._

### Additional Functionality

The above code snippet is a good simple example of an extension. However, as your extensions grow, you'll probably find that they start getting quite large. In that case, you'll probably want to break your functions out into separate folders.

Just like Gluegun itself, we recommend a separate folder for these. Gluegun uses `src/toolbox`, but you can name it whatever makes sense for you. Here's an example:

```
commands
  hello
    world.js
extensions
  hello-extension.js
toolbox
  greetings
    earthling.js
    martian.js
    venusian.js
```

You can access Gluegun tools by using `require` (or `import` if you're using TypeScript).

```js
const { print } = require('gluegun/print')

// toolbox/greetings/earth.js
module.exports = () => print.info('Hello, earthling!'),
```

Then attach the functions or objects to your toolbox:

```js
// extensions/hello-extension.js
const earthling = require('../toolbox/greetings/earthling')
const martian = require('../toolbox/greetings/martian')
const venusian = require('../toolbox/greetings/venusian')

module.exports = toolbox => {
  toolbox.hello = { earthling, martian, venusian }
}
```

### Performance

If you use many NPM packages, it's a good idea for performance reasons to "hide" `require` statements inside your command `run` functions so only the command that is invoked loads its dependencies. ([Here](https://github.com/aws-amplify/amplify-cli/pull/511) is an example that improved Amazon AWS Amplify CLI performance by nearly 2.5x)

_Don't do this_

```js
const R = require('ramda')

module.exports = {
  name: 'mycommand',
  run: async toolbox => {
    // use Ramda
  },
}
```

_Do this_

```js
module.exports = {
  name: 'mycommand',
  run: async toolbox => {
    const R = require('ramda')
    // use Ramda
  },
}
```

`require` will only load on-demand when the function is run. It will also only load `ramda` once (in the examples given) even if you `require` multiple times. So you can safely `require('ramda')` in as many functions or extensions as you want.

## Additional Topics

The topics above will get you very far. Some other things to consider as you dig deeper into your CLI are:

1.  Where do I access and store configuration values?
2.  How do consumers of my CLI install and configure [plugins](/plugins)?
3.  How will templates be organized? (Hint: look at the [Gluegun CLI source](https://github.com/infinitered/gluegun/tree/master/src/cli))
