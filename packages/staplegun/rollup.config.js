import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [
    babel({
      babelrc: false,
      presets: ['es2015-rollup', 'stage-0'],
      plugins: ['transform-decorators-legacy', 'transform-flow-strip-types']
    })
  ],
  dest: 'dist/staplegun'
}
