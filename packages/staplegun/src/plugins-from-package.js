const jetpack = require('fs-jetpack')
const { isNilOrEmpty, dotPath } = require('ramdasauce')
const { keys, map, when, always, pipe } = require('ramda')

/**
 * Gets a list of directories paths for the staplegun plugins
 * listed in the package.json.
 * @param  {?string}  directory The starting directory
 * @return {string[]}             A list of directories.
 */
function getPluginDirectoriesFromPackage (directory) {
  return pipe(
    when(isNilOrEmpty, always(jetpack.cwd())),      // default to the current directory
    x => jetpack.read(`${x}/package.json`, 'json'), // read the package.json there
    when(isNilOrEmpty, always({})),                 // default to {}
    dotPath('staplegun.plugins'),                   // grab the plugins
    when(isNilOrEmpty, always({})),                 // default to {}
    keys,                                           // grab the keys
    map(x => `${jetpack.cwd()}/node_modules/${x}`)  // those are our modules
  )(directory)
}

module.exports = getPluginDirectoriesFromPackage
