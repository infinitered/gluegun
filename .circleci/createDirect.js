/**
 * This script creates the files necessary to access Gluegun tools directly.
 *
 * For example:
 *
 * const { print } = require('gluegun/print')
 *
 * It drops the files into the root directory just prior to releasing a new
 * version of Gluegun.
 *
 * They are .gitignore'd by version control and quickly cleaned up after release.
 */

const directFiles = [
  'filesystem',
  'strings',
  'print',
  'system',
  'semver',
  'http',
  'patching',
  'prompt',
  'package-manager',
]

const fs = require('fs')

// add all the direct access files
directFiles.forEach(f => {
  const filename = __dirname + '/../' + f + '.js'
  fs.writeFileSync(filename, `module.exports = require('./build/${f}')\n`)
})

// add the toolbox.js file for backwards compatibility
fs.writeFileSync(
  __dirname + '/../toolbox.js',
  `// for backwards compatibility with beta-rc7
module.exports = require('./build/index')
`,
)
