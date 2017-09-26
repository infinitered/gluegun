
And what about the CLI you make? Depending on the features you want, more or less:

```sh
npm i --save gluegun
```

** index.js **
```js
// ready
const { build } = 'gluegun'

// aim
const runtime = build()
  .brand('movie')
  .configFile('./movie.toml')
  .loadDefault(`${__dirname}/core-plugins`)
  .load('~/Desktop/movie/quote')
  .loadAll('~/Downloads/VariousMoviePlugins')
  .defaultCommand('help')
  .createRuntime()

// fire!
runtime.run()
```
