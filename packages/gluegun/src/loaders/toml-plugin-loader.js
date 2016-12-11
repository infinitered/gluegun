const jetpack = require('fs-jetpack')
const Plugin = require('../domain/plugin')
const loadCommandFromFile = require('./command-loader')
const loadExtensionFromFile = require('./extension-loader')
const { isNotDirectory } = require('../utils/filesystem-utils')
const { isBlank } = require('../utils/string-utils')
const { concat, map, contains, __ } = require('ramda')
const toml = require('toml')

/**
 * Is this namespace permitted?
 *
 * @param  {string} namespace The namespace to check
 * @return {bool}             `true` if this is restricted, otherwise `false`
 */
const isRestrictedNamespace = contains(__, ['project'])

/**
 * Loads a plugin from a directory.
 *
 * @param {string} directory The full path to the directory to load.
 * @param {{}}     options   Additional options to customize the loading process.
 */
function loadFromDirectory (directory, options = {}) {
  const plugin = new Plugin()

  const brand = options.brand || 'gluegun'
  const commandFilePattern = options.commandFilePattern || '*.js'
  const extensionFilePattern = options.extensionFilePattern || '*.js'
  const namespace = options.namespace
  if (!isBlank(namespace)) {
    plugin.namespace = namespace
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

  // the directory is the default namespace (unless we were told what it was)
  if (isBlank(namespace)) {
    plugin.namespace = jetpack.inspect(directory).name
  }

  const jetpackPlugin = jetpack.cwd(plugin.directory)

  // load the commands found in the commands sub-directory
  if (jetpackPlugin.exists('commands') === 'dir') {
    plugin.commands = map(
      file => loadCommandFromFile(`${directory}/commands/${file}`),
      jetpackPlugin.cwd('commands').find({ matching: commandFilePattern, recursive: false })
      )
  } else {
    plugin.commands = []
  }

  // load the commands found in the commands sub-directory
  if (jetpackPlugin.exists('extensions') === 'dir') {
    plugin.extensions = map(
      file => loadExtensionFromFile(`${directory}/extensions/${file}`),
      jetpackPlugin.cwd('extensions').find({ matching: extensionFilePattern, recursive: false })
      )
  } else {
    plugin.extensions = []
  }
  // if we have a config toml
  try {
    // attempt to load the toml file
    const tomlFile = `${directory}/${brand}.toml`

    // read it
    const config = toml.parse(jetpack.read(tomlFile))

    // set the namespace if we have one (unless we were told what it was)
    if (isBlank(namespace)) {
      plugin.namespace = config.namespace || plugin.namespace
    }
    plugin.defaults = config.defaults || {}
    plugin.description = config.description

    // restrict name

    // also load commands located in the commands brand
    const commandsFromConfig = map(
      config => {
        const { name, file, description } = config
        const command = loadCommandFromFile(`${directory}/${file}`)
        command.name = name
        command.description = description
        return command
      },
      config.commands || []
      )

    // add our commands to the list
    plugin.commands = concat(commandsFromConfig, plugin.commands)
  } catch (e) {
    // no worries, configs are optional
  }

    // check for restricted names
  if (isRestrictedNamespace(plugin.namespace)) {
    plugin.loadState = 'error'
    plugin.errorState = 'badnamespace'
    return plugin
  }

  // we are good!
  plugin.loadState = 'ok'
  plugin.errorState = 'none'

  return plugin
}

module.exports = loadFromDirectory
