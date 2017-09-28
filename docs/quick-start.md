
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
  .src(`${__dirname}`)
  .plugin('~/Desktop/movie/quote')
  .plugins('~/Downloads/VariousMoviePlugins')
  .create()

// fire!
runtime.run()
```
