# Guide: Architecting Your Gluegun CLI

There are many ways to architect Gluegun-powered CLIs. This guide is intended to be a living document, collecting the lessons learned along the way of building CLIs with Gluegun. It is not necessarily the only correct way to build a CLI.

If you have ideas, suggestions, or questions, feel free to [open an issue](https://github.com/infinitered/gluegun/issues/new)!

## Commands

Commands should be focused on user interaction and not necessarily on implementation details. Don't write your whole app inside a command; instead, parse out user-provided info, then delegate to other functions (provided via extensions, which are described below) to do work.

_Do this_

```js
module.exports = {
  name: 'world',
  alias: ['w', 'earth'],
  run: async toolbox => {
    // in this case, `hello` is provided by an extension
    const { prompt, hello } = toolbox

    // user interaction
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

You don't have to have a default command for a folder. Gluegun will pick up on it (as of 2.0.0-beta.6).

```
commands
  hello
    world.js
```

## Extensions

Think of extensions as "drawers" full of tools in your Gluegun toolbox. In the above example, the `hello` extension adds two functions, `greetEarthling` and `greetAlien`.

```js
module.exports = toolbox => {
  toolbox.hello = {
    greetEarthling: () => toolbox.print.info('Hello, earthling!'),
    greetAlien: () => toolbox.print.info('Greetings, alien!'),
  }
}
```

_Hint: In most cases, you probably don't want to use `prompt` in your extensions. They should be tools and not user flows._

### Additional Functionality

The above code snippet is a good simple example of an extension. However, as your extensions grow, you'll probably find that they start getting quite large. In that case, you'll probably want to break your functions out into separate folders.

Just like Gluegun itself, we recommend a separate folder for these. Gluegun uses `src/toolbox`, but you can name it whatever makes sense for you. Here's an example:

```
commands
  hello
    world.js
extensions
  hello-extension.js
hello
  greetings
    earthling.js
    martian.js
    venusian.js
```

One problem is that these other functions won't have access to the `toolbox`, since they're just JS files, not Gluegun-powered. You can solve this a couple different ways. One way is to use _dependency injection_, like this:

```js
// hello/greetings/earth.js
module.exports = toolbox => {
  const { print: { info } } = toolbox
  return {
    greetEarthling: () => info('Hello, earthling!'),
  }
}
```

Then pass in the toolbox:

```js
// extensions/hello-extension.js
import earthling from '../hello/greetings/earthling'
import martian from '../hello/greetings/martian'
import venusian from '../hello/greetings/venusian'
module.exports = toolbox => {
  const { greetEarthling } = earthling(toolbox)
  const { greetMartian } = martian(toolbox)
  const { greetVenusian } = venusian(toolbox)
  toolbox.hello = { greetEarthling, greetMartian, greetVenusian }
}
```

This has the effect of making these functions easier to test, too, since you can pass in a "fake" toolbox to each of them to capture the side effects of these functions.

Another option is to use the Gluegun _on-demand toolbox_.

```js
// hello/greetings/earth.js
import { print: { info } } from 'gluegun/toolbox'

module.exports = {
  greetEarthling: () => info('Hello, earthling!')
}
```

This would result in a somewhat simpler extension:

```js
/// extensions/hello-extension.js
import { greetEarthling } from '../hello/greetings/earthling'
import { greetMartian } from '../hello/greetings/martian'
import { greetVenusian } from '../hello/greetings/venusian'
module.exports = toolbox => {
  toolbox.hello = { greetEarthling, greetMartian, greetVenusian }
}
```

The downside is that the on-demand `toolbox` doesn't include runtime properties like `parameters`. It's also harder to mock tests.

We recommend using _dependency injection_ (above) in most cases, but this is a matter of preference.

## Additional Topics

The topics above will get you very far. Some other things to consider as you dig deeper into your CLI are:

1. Where do I access and store configuration values?
2. How do consumers of my CLI install and configure [plugins](/plugins)?
3. How will templates be organized? (Hint: look at the [Gluegun CLI source](https://github.com/infinitered/gluegun/tree/master/src/cli))
