const jetpack = require('fs-jetpack')
const { pipe, propOr } = require('ramda')
const toml = require('toml')

/**
 * Gets a list of directories paths for the gluegun plugins
 * listed in the toml file.
 *
 * @param  {string}  path The path to the toml file.
 * @return {string[]}     A list of plugin keys.
 */
function getPluginsFromConfig (path) {
  return pipe(
    jetpack.read, // read the file
    toml.parse, // parse it
    propOr([], 'plugins') // grab the plugins or []
  )(path)
}

module.exports = getPluginsFromConfig
