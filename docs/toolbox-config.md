You can have your plugin authors configure the behavior of your CLI by providing a configuration file in the root of any plugin. You can also provide one in the root level of the main CLI.

This is an object. Each plugin will have its own root level key.

In `movies.config.js`:

```js
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

In `movies-imdb.config.js`:

```js
module.exports = {
  name: 'movies-imdb',
  defaults: {
    fun: true,
    level: 10,
  },
}
```

It takes the plugin's defaults, and merges the user's changes overtop.

```js
module.exports = async function(toolbox) {
  toolbox.config.movies // { fun: true, level: 10 }
}
```
