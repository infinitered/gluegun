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
module.exports = async toolbox => {
  toolbox.config.movies // { fun: true, level: 10 }
}
```

If you'd like to load your own config files, use the `loadConfig` function included in the config object which is powered by [cosmiconfig](https://github.com/davidtheclark/cosmiconfig):

```js
module.exports = {
  run: async toolbox => {
    const {
      config: { loadConfig },
      print: { info },
      runtime: { brand },
    } = toolbox

    // use cosmiconfig directly: brand (string) & directory (string)
    const myConfig = loadConfig(brand, process.cwd())
    // or
    const myConfig = loadConfig('movie', '~/.myconfig/')

    // now access myConfig
    info(myConfig.shirtSize)

    // if you want to load multiple configs and have them override:
    const currentFolder = process.cwd()
    const myConfig = {
      ...loadConfig('movies', '~/.myconfig/'),
      ...loadConfig('movies', '~/configurations/myconfig/'),
      ...loadConfig('movies', currentFolder),
    }
  },
}
```

By default, Cosmiconfig will start where you tell it to start and search up the directory tree for the following:

- a package.json property
- a JSON or YAML, extensionless "rc file"
- an "rc file" with the extensions .json, .yaml, .yml, or .js.
- a .config.js CommonJS module

For example, if your module's name is "soursocks", cosmiconfig will search up the directory tree for configuration in the following places:

- a soursocks property in package.json
- a .soursocksrc file in JSON or YAML format
- a .soursocksrc.json file
- a .soursocksrc.yaml, .soursocksrc.yml, or .soursocksrc.js file
- a soursocks.config.js file exporting a JS object

Cosmiconfig continues to search up the directory tree, checking each of these places in each directory, until it finds some acceptable configuration (or hits the home directory).
