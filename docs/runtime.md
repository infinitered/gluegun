# The Gluegun API

With the Gluegun API, you're able to load & execute commands.

Check out the [sanity](./sanity.md) module for detecting if your environment is able to run.

# Gluegun.build

Grab the `build` function from `gluegun-core`.

```js
const { build } = require('gluegun-core')
```

Now let's build a `gluegun` runtime environment by configuring various features.

```js
const runtime = build()
```

But out of the box, it does very little.  And by very little I mean nothing.  So let's configure this.

We'll be chaining the `build()` function from here.


# Brand

**Brand** is used through-out the glue for things like configuration file names and folder names for plugins.
 
```js
  .brand('movie')
```

The brand is most likely to share the same name of the CLI.

# Plugins

Functionality is added to the `Gluegun` object with [plugins](./plugins.md). Plugins can be yours or your users.

You can load a plugin from a directory:

```js
  .load('~/Desktop/movie/quote')
  .load('~/Desktop/movie/credits')
```

You can also load all immediate sub-directories located within it a directory.

```js
  .loadAll('~/Downloads/VariousMoviePlugins')
```

# Finishing Configuration

At this point, we've been configuring our environment.  When we're ready, we call:

```js
  .createRuntime()
```

This command makes applies the configuration that you were just chaining, and turns it into a `Runtime` which supports calling `run()`.

```js
  const runtime = build()
    .brand('movie')
    .load('~/Desktop/movie/quote')
    .load('~/Desktop/movie/credits')
    .loadAll('~/Downloads/VariousMoviePlugins')
    .createRuntime()
```

And now we're ready to run:

```js
  runtime.run()
```

With no parameters, `gluegun-core` will parse the command line arguments looking for the commmand to run.

```sh
# list the plugins
$ movie

# list the commands of a plugin
$ movie quote

# run a command
$ movie quote random

# run a command with options
$ movie quote random --funny

# run a command with arguments
$ movie credits actors Kingpin

# run a command with arguments & options
$ movie credits producers "Planes, Trains, & Automobiles" --sort age 
```

So you see, it takes at least 2 extra arguments to run a command. That's because you can have multiple plugins and we need to qualify your commands with a namespace.

Which sucks, if it weren't for:

# The Default Plugin

One of your plugins can be a special snowflake.

```js
  .loadDefault('~/Desktop/movie/credits')
```

Normally the command line order goes:

1. `program`
2. `plugin`
3. `command`

With the default plugin, however, we drop the `plugin` and it becomes:

1. `program`
2. `command`

So, from our previous section, had we promoted the credits plugin to default, we could access it's actions like this:

```sh
# run a command with arguments
$ movie actors Kingpin

# run a command with arguments & options
$ movie producers "Planes, Trains, & Automobiles" --sort age 
```

Commands from the default plugin will now be evaluated first. If there is a match, they will be chosen over any other plugins.


For simpler CLIs, you might find this is a much easier way to build. You might not need the flexibility of multiple plugins and can get away with 1 plugin which is installed as the default.

# Advanced Running

`Gluegun` can also be `run()` with options.

```js
await runtime.run({
  pluginName: 'quote',
  rawArguments: 'random "*johnny"',
  options: {
    funny: true,
    genre: 'Horror',
    weapon: 'axe'
  }
})
```

There's a few situations that make this useful.

1. Maybe you like to use `meow` or `commander` to parse the command line. 
2. Maybe your interface isn't a CLI.
3. Maybe you want to run several command in a row.
4. Maybe this is your program and you don't like strangers telling you how to code.

Bottom line, is you get to pick. It's yours. `gluegun-core` is just glue.

# Tokens

Command and extension can have some meta data embedded in a JavaScript comment. This is how you're able to set the:

* command name
* command description
* extension name

You can configure this setting

```js
  .token('commandName', 'omgCommand')
  .token('commandDescription', 'lolDescription')
  .token('extensionName', 'sweet!!!')
```

The token you choose will still be prefixed by a `@` when it searches in the file.  It also needs to remain located within a JavaScript comment.


# Summary

Here's the full API in action.

```js
const { build } = 'gluegun-core'

await build()
  .brand('movie')
  .loadDefault(`${__dirname}/core-plugins`)
  .load('~/Desktop/movie/quote')
  .load('~/Desktop/movie/credits')
  .loadAll('~/Downloads/VariousMoviePlugins')
  .token('commandName', 'cliCommand')
  .token('commandDescription', 'cliDescription')
  .token('extensionName', 'contextExtension')
  .on('start', () => {
    console.log('Welcome to movie CLI!')
  })
  .createRuntime()
  .run()

```
