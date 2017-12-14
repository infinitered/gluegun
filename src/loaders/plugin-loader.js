const jetpack = require('fs-jetpack')
const Plugin = require('../domain/plugin')
const { loadConfig } = require('./config-loader')
const { loadCommandFromFile } = require('./command-loader')
const { loadExtensionFromFile } = require('./extension-loader')
const { isNotDirectory } = require('../utils/filesystem-utils')
const { isBlank } = require('../utils/string-utils')
const { assoc, map } = require('ramda')

/**
 * Loads a plugin from a directory.
 *
 * @param {string} directory The full path to the directory to load.
 * @param {{}}     options   Additional options to customize the loading process.
 */
function loadPluginFromDirectory (directory, options = {}) {
  const plugin = new Plugin()

  const {
    brand = 'gluegun',
    commandFilePattern = [`*.{js,ts}`, `!*.test.{js,ts}`],
    extensionFilePattern = [`*.{js,ts}`, `!*.test.{js,ts}`],
    hidden = false,
    name
  } = options

  plugin.hidden = Boolean(options.hidden)

  if (!isBlank(name)) {
    plugin.name = name
  }

  // directory check
  if (isNotDirectory(directory)) {
    throw new Error(`Error: couldn't load plugin (not a directory): ${directory}`)
  }

  plugin.directory = directory

  // the directory is the default name (unless we were told what it was)
  if (isBlank(name)) {
    plugin.name = jetpack.inspect(directory).name
  }

  const jetpackPlugin = jetpack.cwd(plugin.directory)

  // load the commands found in the commands sub-directory
  if (jetpackPlugin.exists('commands') === 'dir') {
    const commands = jetpackPlugin
      .cwd('commands')
      .find({ matching: commandFilePattern, recursive: true })

    plugin.commands = map(file => loadCommandFromFile(`${directory}/commands/${file}`), commands)
  } else {
    plugin.commands = []
  }

  // load the extensions found in the extensions sub-directory
  if (jetpackPlugin.exists('extensions') === 'dir') {
    const extensions = jetpackPlugin
      .cwd('extensions')
      .find({ matching: extensionFilePattern, recursive: false })

    plugin.extensions = map(
      file => loadExtensionFromFile(`${directory}/extensions/${file}`),
      extensions
    )
  } else {
    plugin.extensions = []
  }

  // load config using cosmiconfig
  const config = loadConfig(plugin.name, directory)

  // set the name if we have one (unless we were told what it was)
  plugin.name = config.name || plugin.name
  plugin[brand] = config[brand]
  plugin.defaults = config.defaults || {}
  plugin.description = config.description

  // set the hidden bit
  if (hidden) {
    plugin.commands = map(assoc('hidden', true), plugin.commands)
  }

  return plugin
}

module.exports = { loadPluginFromDirectory }
