const cosmiconfig = require('cosmiconfig')

/**
 * Loads the config for the app via CosmicConfig by searching in a few places.
 *
 * @param {string} name The base name of the config to load.
 * @param {string} src The directory to look in.
 */
function loadConfig (name, src) {
  const cosmicOpts = {
    sync: true, // load the config synchronously
    rcExtensions: true // allow .namerc.yaml and .namerc.json as well
  }

  // attempt to load
  const cosmic = cosmiconfig(name, cosmicOpts).load(src)

  // use what we found or fallback to an empty object
  const config = (cosmic && cosmic.config) || {}
  return config
}

module.exports = { loadConfig }
