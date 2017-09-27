With the gluegun API, you're able to load & execute commands.

Check out the [sniff](./sniff.md) module for detecting if your environment is able to run.


Here's what we're about to cover.

```js
const { build } = 'gluegun'

await build()
  .brand('movie')
  .src('${__dirname})
  .plugins('./node_modules', { pattern: 'movie-' })
  .plugin('~/.movie/movie-imdb')
  .create()
  .run()
```


## build

Grab the `build` function from `gluegun`.

```js
const { build } = require('gluegun')
```

Now let's build a `gluegun` cli environment by configuring various features.

```js
const cli = build()
```

But out of the box, it does very little.  And by very little I mean nothing.  So let's configure this.

We'll be chaining the `build()` function from here.


## brand

**Brand** is used through-out the glue for things like configuration file names and folder names for plugins.

```js
  .brand('movie')
```

The brand is most likely to share the same name of the CLI.


## src

This sets where the default commands and extensions are located, in
`commands` and `extensions` folders, respectively.

```js
  .src('~/Desktop/movie/credits')
```

When you run a command, it'll first load these extensions and then check this
set of commands for the right command.

```sh
# run a command with arguments
$ movie actors Kingpin

# run a command with arguments & options
$ movie producers "Planes, Trains, & Automobiles" --sort age
```

For most CLIs, you might find this is all you need.


## create

At this point, we've been configuring our environment.  When we're ready, we call:

```js
  .create()
```

This command applies the configuration that you were just chaining, and turns it into a `runtime cli` which supports calling `run()`.

```js
  const cli = build()
    .brand('movie')
    .src(`${__dirname}`)
    .plugin('~/Desktop/movie/credits')
    .plugins('~/Downloads/VariousMoviePlugins')
    .create()
```

And now we're ready to run:

```js
  cli.run()
```

With no parameters, `gluegun` will parse the command line arguments looking for the commmand to run.

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


## plugin

Functionality is added to the `gluegun` object with [plugins](./plugins.md). Plugins can be yours or your users.

Briefly, a plugin is a folder that contains a structure something like this:

```
credits
  commands
    actors.js
    producers.js
  extensions
    retrieve-imdb.js
  templates
    actor-view.js.ejs
  gluegun.toml
```

You can load a plugin from a directory:

```js
  .plugin('~/Desktop/movie/quote')
  .plugin('~/Desktop/movie/credits')
```

## plugins

You can also load multiple plugins within a directory.

```js
  .plugins('~/Downloads/VariousMoviePlugins')
```

Load all supports a `fs-jetpack` [matching pattern](https://github.com/szwacz/fs-jetpack#findpath-searchoptions) so you can filter out a subset of directories instead of just all.

```js
  .plugins('node_modules', { matching: 'movies-*' })
```

If you would like to keep plugins hidden and not available at the command line:

```js
  .plugins('node_modules', { matching: 'movies-*', hidden: true })
```

When plugins are hidden they can still be run directly from the cli.


## run

`gluegun` can also be `run()` with options.

```js
await cli.run('quote random "*johnny"', {
  funny: true,
  genre: 'Horror',
  weapon: 'axe'
})
```

There's a few situations that make this useful.

1. Maybe you like to use `meow` or `commander` to parse the command line.
2. Maybe your interface isn't a CLI.
3. Maybe you want to run several command in a row.
4. Maybe this is your program and you don't like strangers telling you how to code.

Bottom line, is you get to pick. It's yours. `gluegun` is just glue.

## configFile

Each plugin can have its own configuration file where it places defaults.  These defaults can then be overridden by reading defaults from a configuration file.

You can specify your config file to read from the current directory like this:

```js
  .configFile('./movie.toml')
```

A configuration file is a [TOML](./what-is-toml.md) file.

It will read the plugin name from the `name` key and the defaults will be read from the `[defaults]` section.  Each section underneath `default` can be used to override the sections of the plugin.  Since that was horribly explained, here's an example.

```toml
[defaults.movie]
cache = '~/.movies/cache'

[defaults.another]
count = 100
```
