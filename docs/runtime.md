With the gluegun API, you're able to load & execute commands.

Check out the [sniff](./sniff.md) module for detecting if your environment is able to run.

Here's a kitchen sink version, which we're about to cover.

```js
const { build } = 'gluegun'

const cli = build('movie')
  .src(__dirname)
  .plugin('~/.movie/movie-imdb')
  .plugins('./node_modules', { pattern: 'movie-' })
  .help()
  .version()
  .defaultCommand()
  .command({ name: 'hi', run: toolbox => toolbox.print.info('hi!') })
  .exclude(['filesystem', 'semver', 'system', 'prompt', 'http'])
  .create()

await cli.run()
```

## build

Grab the `build` function from `gluegun`.

```js
const { build } = require('gluegun')
```

Now let's build a `gluegun` cli environment by configuring various features.

```js
const cli = build('mycli')
```

The `mycli` brand that you pass into `build` is used through-out gluegun for things like configuration file names and folder names for plugins. You can also set it later, like this:

```js
const cli = build().brand('movie')
```

Out of the box, this CLI does very little. And by very little I mean nothing. So let's configure this. We'll be chaining the `build()` function from here.

## src

This sets where the default commands and extensions are located, in
`commands` and `extensions` folders, respectively.

```js
const cli = build('movie').src(__dirname)
```

When you run a command, it'll first load extensions in this folder and then check the commands in this folder for the right command.

```sh
# run a command with arguments
$ movie actors Kingpin

# run a command with arguments & options
$ movie producers "Planes, Trains, & Automobiles" --sort age
```

## plugin

Additional functionality can be added to the `gluegun` object with [plugins](./plugins.md). Plugins can be yours or your users.

A plugin is a folder (or NPM package) that contains a structure - something like this:

```
movie-credits
  commands
    actors.js
    producers.js
  extensions
    retrieve-imdb.js
  templates
    actor-view.js.ejs
  movie.config.js
```

You can load a plugin from a directory:

```js
const cli = build('movie')
  .src(__dirname)
  .plugin('~/.movie/movie-imdb')
```

## plugins

You can also load multiple plugins within a directory.

```js
const cli = build('movie')
  .src(__dirname)
  .plugin('~/.movie/movie-imdb')
  .plugins('./node_modules', { pattern: 'movie-' })
```

`plugins` supports a `fs-jetpack` [matching pattern](https://github.com/szwacz/fs-jetpack#findpath-searchoptions) so you can filter out a subset of directories instead of just all.

```js
  .plugins('./node_modules', { matching: 'movies-*' })
```

If you would like to keep plugins hidden and not available at the command line:

```js
  .plugins('./node_modules', { matching: 'movies-*', hidden: true })
```

When plugins are hidden they can still be run directly from the cli.

## help

Gluegun ships with a somewhat adequate `help` screen out of the box. Add it to your
CLI easily by calling `.help()`.

```js
const cli = build('movie')
  .src(__dirname)
  .plugins('./node_modules', { pattern: 'movie-' })
  .plugin('~/.movie/movie-imdb')
  .help()
```

You can also pass in a function or command object here:

```js
  .help(toolbox => toolbox.print.info('No help for you!'))
  .help({
    name: 'help',
    alias: 'helpmeplease',
    hidden: true,
    dashed: true,
    run: toolbox => toolbox.print.info('No help for you!')
  })
```

## version

You usually like to be able to run `--version` to see your CLI's version from the command
line, so add it easily with `.version()`.

```js
const cli = build('movie')
  .src(__dirname)
  .plugins('./node_modules', { pattern: 'movie-' })
  .plugin('~/.movie/movie-imdb')
  .help()
  .version()
```

Just like `help` above, you can pass in a function or command object to configure it further.

## defaultCommand

If the user runs your CLI and doesn't supply any matching parameters, it'll run this command
instead. Note that you can do this by supplying a `<brand>.js` file in your `./commands`
folder as well.

```js
const cli = build('movie')
  .src(__dirname)
  .plugins('./node_modules', { pattern: 'movie-' })
  .plugin('~/.movie/movie-imdb')
  .help()
  .version()
  .defaultCommand()
```

Just like `help` and `version` above, you can pass in a function or command object if
you prefer more control.

## command

If you want to pass in arbitrary commands, you can do that with `.command()`.

```js
const cli = build('movie')
  .src(__dirname)
  .plugins('./node_modules', { pattern: 'movie-' })
  .plugin('~/.movie/movie-imdb')
  .help()
  .version()
  .defaultCommand()
  .command({ name: 'hi', run: toolbox => toolbox.print.info('hi!') })
```

In this case, if you ran `movie hi`, it would run the function provided and print out 'hi!'.

You must provide an object with at least a `name` and a `run` function, which can be
`async` or regular.

## exclude

If you don't need certain core extensions, you can skip loading them (thus improving startup time) by using `.exclude()`. Just pass in an array of string names for the core extensions you don't need.

```js
const cli = build('movie').exclude([
  'meta',
  'strings',
  'print',
  'filesystem',
  'semver',
  'system',
  'prompt',
  'http',
  'template',
  'patching',
])
```

If you find you need one of these extensions for just _one_ command but don't want to load it for _all_ of your commands, you can always load it separately from the Gluegun toolbox, like this:

```js
const { prompt } = require('gluegun')
```

For reference, the core extensions that incur the biggest startup performance penalty are (timing varies per machine, but this gives some sense of scale):

```
prompt +100ms
print +45ms
http +30ms
system +10ms
```

## create

At this point, we've been configuring our CLI. When we're ready, we call `create()`:

```js
const cli = build('movie')
  .src(__dirname)
  .plugins('./node_modules', { pattern: 'movie-' })
  .plugin('~/.movie/movie-imdb')
  .help()
  .version()
  .defaultCommand()
  .command({ name: 'hi', run: toolbox => toolbox.print.info('hi!') })
  .create()
```

This command applies the configuration that you were just chaining, and turns it into a `runtime cli` which supports calling `run()`.

And now we're ready to run:

```js
cli.run()
```

With no parameters, `gluegun` will parse the command line arguments looking for the command to run.

```sh
# list the plugins
$ movie

# run a command
$ movie quote

# run a command with options
$ movie quote --funny

# run a command with arguments
$ movie actors Kingpin

# run a command with arguments & options
$ movie producers "Planes, Trains, & Automobiles" --sort age
```

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
3. Maybe you want to run several commands in a row.
4. Maybe this is your program and you don't like strangers telling you how to code.

Bottom line is, you get to pick. It's yours. `gluegun` is just glue.

## configuration

Each plugin can have its own configuration file where it places defaults. These defaults can then be overridden by reading defaults from a configuration file or entry in `package.json`. We use [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) for this.

It will read the plugin name from the `name` key and the defaults will be read from the `defaults` section. Each section underneath `default` can be used to override the sections of the plugin. Since that was horribly explained, here's an example.

```js
// in movies.config.js
module.exports = {
  name: 'movies',
  defaults: {
    movie: {
      cache: '~/.movies/cache',
    },
    another: {
      count: 100,
    },
  },
}
```
