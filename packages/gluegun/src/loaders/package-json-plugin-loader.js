const jetpack = require('fs-jetpack')
const Plugin = require('../domain/plugin')
const loadCommandFromFile = require('./command-loader')
const { isNotFile, isNotDirectory } = require('../utils/filesystem-utils')
const { isBlank } = require('../utils/string-utils')
const { map, flatten } = require('ramda')

/**
 * Loads a command based on the entry in the package.json
 */
function loadCommandFromConfig (directory, config) {
  const { name, file, functionName, description } = config
  const command = loadCommandFromFile(`${directory}/${file}`, functionName)
  command.name = name
  command.description = description
  return command
}

/**
 * Loads a plugin from a directory.
 *
 * @param {string} directory The full path to the directory to load.
 * @param {{}}     options   Additional options to customize the loading process.
 */
function loadFromDirectory (directory, options = {}) {
  const key = options.key || 'gluegun'
  const commandFilePattern = options.commandFilePattern || 'commands/*.js'

  const plugin = new Plugin()

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

  // check for package.json
  const packagePath = `${directory}/package.json`
  if (isNotFile(packagePath)) {
    plugin.loadState = 'error'
    plugin.errorState = 'missingpackage'
    return plugin
  }

  // Load 'er up
  try {
    // read the file
    const pkg = jetpack.read(packagePath, 'json')
    const root = pkg[key]
    if (!root) throw new Error('missing root key')

    // validate the namespace
    if (isBlank(root.namespace)) {
      plugin.loadState = 'error'
      plugin.errorState = 'namespace'
      return plugin
    }

    // read the defaults & commands
    plugin.namespace = root.namespace
    plugin.defaults = root.defaults || {}

    // grab the commands from the package.json
    const commandsFromConfig = map(
      config => {
        return loadCommandFromConfig(directory, config)
      },
      root.commands || []
      )

    // with each commands/*.js, load'em up
    const commandsFromCommandsDir = map(
      file => loadCommandFromFile(`${directory}/${file}`),
      jetpack.cwd(plugin.directory).find({ matching: commandFilePattern })
      )

    // glue them together
    plugin.commands = flatten([commandsFromConfig, commandsFromCommandsDir])

    // we are good!
    plugin.loadState = 'ok'
    plugin.errorState = 'none'
    plugin.errorMessage = null
  } catch (e) {
    plugin.exception = e
    plugin.loadState = 'error'
    plugin.errorState = 'badpackage'
  }

  return plugin
}

module.exports = loadFromDirectory
