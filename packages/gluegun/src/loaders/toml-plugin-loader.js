const jetpack = require('fs-jetpack')
const Plugin = require('../domain/plugin')
const loadCommandFromFile = require('./command-loader')
const loadExtensionFromFile = require('./extension-loader')
const { isNotDirectory } = require('../utils/filesystem-utils')
const { isBlank } = require('../utils/string-utils')
const { assoc, map } = require('ramda')
const toml = require('toml')

/**
 * Loads a plugin from a directory.
 *
 * @param {string} directory The full path to the directory to load.
 * @param {{}}     options   Additional options to customize the loading process.
 */
function loadFromDirectory (directory, options = {}) {
  const plugin = new Plugin()

  const {
    brand = 'gluegun',
    commandFilePattern = '*.js',
    extensionFilePattern = '*.js',
    hidden = false,
    commandNameToken,
    commandHiddenToken,
    commandAliasToken,
    commandDescriptionToken,
    extensionNameToken,
    name
  } = options

  plugin.hidden = Boolean(options.hidden)

  if (!isBlank(name)) {
    plugin.name = name
  }

  // sanity check the input
  if (isBlank(directory)) {
    plugin.loadState = 'error'
    plugin.errorState = 'input'
    return plugin
  }

  // directory check
  if (isNotDirectory(directory)) {
    plugin.loadState = 'error'
    plugin.errorState = 'missingdir'
    return plugin
  }

  plugin.directory = directory

  // the directory is the default name (unless we were told what it was)
  if (isBlank(name)) {
    plugin.name = jetpack.inspect(directory).name
  }

  const jetpackPlugin = jetpack.cwd(plugin.directory)

  // load the commands found in the commands sub-directory
  if (jetpackPlugin.exists('commands') === 'dir') {
    plugin.commands = map(
      file =>
        loadCommandFromFile(`${directory}/commands/${file}`, {
          commandNameToken,
          commandDescriptionToken,
          commandHiddenToken,
          commandAliasToken
        }),
      jetpackPlugin
        .cwd('commands')
        .find({ matching: commandFilePattern, recursive: false })
    )
  } else {
    plugin.commands = []
  }

  // load the commands found in the commands sub-directory
  if (jetpackPlugin.exists('extensions') === 'dir') {
    plugin.extensions = map(
      file =>
        loadExtensionFromFile(`${directory}/extensions/${file}`, {
          extensionNameToken
        }),
      jetpackPlugin
        .cwd('extensions')
        .find({ matching: extensionFilePattern, recursive: false })
    )
  } else {
    plugin.extensions = []
  }
  // if we have a config toml
  try {
    // attempt to load the toml file
    const tomlFile = `${directory}/${brand}.toml`

    // read it
    const config = toml.parse(jetpack.read(tomlFile) || '')

    // set the name if we have one (unless we were told what it was)
    if (isBlank(name)) {
      plugin.name = config.name || plugin.name
    }
    plugin[brand] = config[brand]
    plugin.defaults = config.defaults || {}
    plugin.description = config.description

    // restrict name
  } catch (e) {
    // no worries, configs are optional
  }

  // we are good!
  plugin.loadState = 'ok'
  plugin.errorState = 'none'

  // set the hidden bit
  if (hidden) {
    plugin.commands = map(assoc('hidden', true), plugin.commands)
  }

  return plugin
}

module.exports = loadFromDirectory
