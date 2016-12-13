# The Gluegun API

With the Gluegun API, you're able to load & execute commands.

Check out the [sanity](./sanity.md) module for detecting if your environment is able to run.

# Gluegun

This is the main class in `gluegun-core`. Let's require it in.

```js
const Gluegun = require('gluegun-core')
```

You create a `Gluegun` object by passing a string that represents the brand.

**Brand** is used through-out the glue for things like configuration file names and folder names for plugins.
 
```js
const glue = Gluegun.create('movie')
```

The brand is most likely to share the same name of the CLI.

# Plugins

Functionality is added to the `Gluegun` object with [plugins](./plugins.md). Plugins can be yours or your users.

You can load a plugin from a directory:

```js
glue.load('~/Desktop/movie/quote')
glue.load('~/Desktop/movie/credits')
```

You can also load all immediate sub-directories located within it a directory.

```js
glue.loadAll('~/Downloads/VariousMoviePlugins')
```

# Ready To Run

At this point, the `Gluegun` environment is ready to go. We've loaded a few plugins, so next we call:

```js
await glue.run()
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
glue.loadDefault('~/Desktop/movie/credits')
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
glue.run({
  pluginName: 'quote',
  commandName: 'random',
  arguments: '"*johnny"',
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

# Recap

So that's it. Here's the full API in action.

```js
const Gluegun = 'gluegun-core'

// create a gluegun environment
const glue = Gluegun.create('movies')

// our plugins
glue.loadDefault(`${__dirname}/core`)

// their plugins
glue.load(`~/.${glue.brand}`)
glue.loadAll(`./${glue.brand}/plugins`)

await glue.run()
```