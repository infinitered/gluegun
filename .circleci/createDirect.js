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

const directFiles = ['toolbox', 'filesystem', 'strings', 'print', 'system', 'semver', 'http', 'patching', 'prompt']

const fs = require('fs')

directFiles.forEach(f => {
  fs.writeFileSync(__dirname + '/..', `module.exports = require('./build/${f}')`)
})
