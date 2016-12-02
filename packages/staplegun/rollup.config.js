import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/index.js',
  format: 'cjs',
  external: [
    'ramda',
    'fs-jetpack',
    'ramdasauce',
    'autobind-decorator',
    'chalk',
    'minimist',
    'babel-runtime/helpers/createClass',
    'babel-runtime/helpers/classCallCheck',
    'babel-runtime/helpers/asyncToGenerator',
    'babel-runtime/regenerator',
    'babel-runtime/core-js/json/stringify'
  ],
  plugins: [
    babel({
      babelrc: false,
      runtimeHelpers: true,
      externalHelpers: true,
      presets: [
        'es2015-rollup',
        'stage-0'
      ],
      plugins: [
        'external-helpers',
        'transform-decorators-legacy',
        'transform-flow-strip-types',
        'transform-runtime'
      ]
    })
  ],
  dest: 'dist/staplegun'
}
