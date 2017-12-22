import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import filesize from 'rollup-plugin-filesize'
import progress from 'rollup-plugin-progress'

export default {
  // tsc (TypeScript compiler) dumps a bunch of JS files in ./build
  // so we go pick them up at the entry point, ./build/index.js
  input: 'build/index.js',

  // we want one file, called `./dist/index.js`
  // we're using cjs format because that's what node likes
  // we also output a sourcemap, because we want to make sure we can debug reasonably well
  output: {
    file: 'dist/index.js',
    format: 'cjs', // commonjs for node
    sourcemap: true,
  },

  // rollup complains if we don't list out all the external dependencies
  // here you go, rollup. now shut up
  external: externalPackages(),

  // rollup out of the box doesn't do anything interesting
  // so we have plugins to make it do interesting things
  plugins: [
    // nice progress bar
    progress(),

    // so it turns out lots of people like to reassign `require` to something else temporarily
    // .. this causes rollup to barf, so we're replacing those with harmless code
    stripProblematicCode(),

    // this converts CommonJS modules to ES6 modules, which is apparently necessary
    commonjs({
      // ignore any dynamic requires, since this plugin can't do anything with them
      // gluegun, of course, uses a lot of dynamic requires!
      ignore: true,
    }),

    // needed to get by some weird error.
    // via https://github.com/rollup/rollup-plugin-commonjs/issues/28#issuecomment-167934572
    json(),

    // shows
    filesize(),
  ],
}

function stripProblematicCode() {
  return {
    name: 'stripProblematicCode',
    transform: (code, id) => {
      return { code: code.split('\nrequire = ').join('\nvar removedRequire = '), id, map: null }
    },
  }
}

function externalPackages() {
  return [
    'util',
    'path',
    'fs',
    'stream',
    'crypto',
    'os',
    'child_process',
    'spawn-sync',
    'assert',
    'events',
    'tty',
    'net',
    'readline',
    'buffer',
    'http',
    'https',
    'url',
    'zlib',
    'module',
    'semver',
    'fs-jetpack',
    'ramda',
    'lodash.camelcase',
    'lodash.kebabcase',
    'lodash.snakecase',
    'lodash.uppercase',
    'lodash.lowercase',
    'lodash.startcase',
    'lodash.upperfirst',
    'lodash.lowerfirst',
    'lodash.pad',
    'lodash.padstart',
    'lodash.padend',
    'lodash.trim',
    'lodash.trimstart',
    'lodash.trimend',
    'lodash.repeat',
    'pluralize',
    'execa',
    'which',
    'cross-spawn',
    'enquirer',
    'prompt-list',
    'prompt-rawlist',
    'prompt-confirm',
    'prompt-expand',
    'prompt-checkbox',
    'prompt-radio',
    'prompt-password',
    'prompt-question',
    'prompt-autocompletion',
    'apisauce',
    'ejs',
    'cosmiconfig',
    'yargs-parser',
    'ramdasauce',
    'colors',
    'cli-table2',
    'ora',
    'app-module-path',
  ]
}
