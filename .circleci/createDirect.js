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
  'toolbox.js',
  'filesystem.js',
  'strings.js',
  'print.js',
  'system.js',
  'semver.js',
  'http.js',
  'patching.js',
  'prompt.js',
]
