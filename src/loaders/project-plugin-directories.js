const { subdirectories } = require('../utils/filesystem-utils')

/**
 * Gets a list of directories for the valid plugins found under
 * the users's project gluegun.
 *
 * @param  {string}   dir The path to the gluegun directory for the project.
 * @return {string[]}     A string list of directories.
 */
module.exports = function (dir) {
  const localPlugins = subdirectories(`${dir}/plugins`)
  const remotePlugins = subdirectories(`${dir}/plugins-remote`)

  return [...localPlugins, ...remotePlugins]
}
