const { map } = require('ramda')
const jetpack = require('fs-jetpack')
const { isDirectory } = require('../utils/filesystem-utils')

/**
 * Gets a list of fully qualified directories from the user's home directory.
 *
 * @param  {string} brand The brand controls the subdirectory off of $HOME
 * @return {string[]}     A string list of directories.
 */
module.exports = function (brand) {
  // load plugins from the $HOME/.<brand>/plugins
  const isWindows = process.platform === /^win/.test(process.platform)
  const homeDir = process.env[isWindows ? 'USERPROFILE' : 'HOME']
  const homePluginsDir = `${homeDir}/.${brand}/plugins`

  // jet if we don't have that directory
  if (!isDirectory(homePluginsDir)) return []

  // grab the directories right under
  const relativeDirs = jetpack
    .cwd(homePluginsDir)
    .find({ matching: '*', directories: true, recursive: false, files: false })

  return map(dir => `${homePluginsDir}/${dir}`, relativeDirs)
}
