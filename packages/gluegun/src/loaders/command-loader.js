const { isNotFile } = require('../utils/filesystem-utils')
const { isBlank } = require('../utils/string-utils')
const loadModule = require('./module-loader')
const jetpack = require('fs-jetpack')
const { head, split } = require('ramda')
const Command = require('../domain/command')
const findTokens = require('./find-tokens')

/**
 * Loads the command from the given file.
 *
 * @param  {string} file      The full path to the file to load.
 * @return {Command}          The command in any condition
 */
function loadFromFile (file, options = {}) {
  const command = new Command()

  const commandNameToken = options.commandNameToken || 'gluegunCommandName'
  const commandDescriptionToken = options.commandDescriptionToken ||
    'gluegunCommandDescription'
  const commandHiddenToken = options.commandHiddenToken ||
    'gluegunCommandHidden'
  const commandAliasToken = options.commandAliasToken || 'gluegunCommandAlias'

  // sanity check the input
  if (isBlank(file)) {
    throw new Error(`Error: couldn't load command (file is blank): ${file}`)
  }

  // remember the file & function
  command.file = file

  // not a file?
  if (isNotFile(file)) {
    throw new Error(`Error: couldn't load command (this isn't a file): ${file}`)
  }

  // default name is the name without the file extension
  command.name = head(split('.', jetpack.inspect(file).name))

  // let's load
  // try reading in tokens embedded in the file
  const tokens = findTokens(jetpack.read(file) || '', [
    commandNameToken,
    commandDescriptionToken,
    commandHiddenToken,
    commandAliasToken
  ])

  // let's override if we've found these tokens
  command.name = tokens[commandNameToken] || command.name
  command.description = tokens[commandDescriptionToken] ||
    command.description
  command.alias = tokens[commandAliasToken] || command.alias
  command.hidden = (tokens[commandHiddenToken] || command.hidden) === 'true'

  // require in the module -- best chance to bomb is here
  const commandModule = loadModule(file)

  // are we expecting this?
  const valid = commandModule && typeof commandModule === 'function'

  if (valid) {
    command.run = commandModule
  } else {
    throw new Error(`Error: Couldn't run ${command.name}. Expected a function, got ${commandModule}.`)
  }

  return command
}

module.exports = loadFromFile
