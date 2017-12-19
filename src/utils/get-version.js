const jetpack = require('fs-jetpack')

/**
 * Finds the version for the currently running CLI.
 *
 * @param {RunContext} context
 */
function getVersion (context) {
  let directory = context.runtime.defaultPlugin && context.runtime.defaultPlugin.directory
  if (!directory) {
    throw new Error('context.version: Unknown CLI version (no src folder found)')
  }

  // go at most 5 directories up to find the package.json
  for (let i = 0; i < 5; i += 1) {
    const pkg = jetpack.path(directory, 'package.json')

    // if we find a package.json, we're done -- read the version and return it
    if (jetpack.exists(pkg) === 'file') {
      return jetpack.read(pkg, 'json').version
    }

    // if we reach the git repo or root, we can't determine the version -- this is where we bail
    const git = jetpack.path(directory, '.git')
    const root = jetpack.path('/')
    if (directory === root || jetpack.exists(git) === 'dir') break

    // go up another directory
    directory = jetpack.path(directory, '..')
  }
  throw new Error(`context.version: Unknown CLI version (no package.json found in ${directory}`)
}

module.exports = { getVersion }
