const jetpack = require('fs-jetpack')
const { isNilOrEmpty, dotPath } = require('ramdasauce')
const { when, always, pipe } = require('ramda')

/**
 * Gets a list of directories paths for the staplegun plugins
 * listed in the package.json.
 *
 * @param  {string}  path The path to the package.json
 * @param  {string}  key  The key to the staplegun node.
 * @return {string[]}     A list of plugin keys.
 */
function getPluginsFromPackage (path, key = 'staplegun') {
  return pipe(
    x => jetpack.read(x, 'json'),   // read the package.json there
    when(isNilOrEmpty, always({})), // default to {}
    dotPath(`${key}.plugins`),      // grab the plugins
    when(isNilOrEmpty, always([]))  // default to {}
  )(path)
}

module.exports = getPluginsFromPackage
