const { isNotFile } = require('../utils/filesystem-utils')
const { isBlank } = require('../utils/string-utils')
const loadModule = require('./module-loader')
const jetpack = require('fs-jetpack')
const { head, split } = require('ramda')
const Command = require('../domain/command')
const findTokens = require('./find-tokens')

/**
 * The load state of the command.
 *
 * none  = not loaded
 * ok    = the command is ready to go
 * error = an error has happened
 */
// export type CommandLoadState = 'none' | 'ok' | 'error'

/**
 * The error state.
 *
 * none        = no errors
 * input       = wierd input
 * missing     = the file is missing
 * badfile     = not a valid javascript file
 * badfunction = the function has not been exported or it's not a function
 */
// export type CommandErrorState = 'none' | 'input' | 'missing' | 'badfile' | 'badfunction'

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
    command.loadState = 'error'
    command.errorState = 'input'
    return command
  }

  // remember the file & function
  command.file = file

  // not a file?
  if (isNotFile(file)) {
    command.loadState = 'error'
    command.errorState = 'missing'
    return command
  }

  // default name is the name without the file extension
  command.name = head(split('.', jetpack.inspect(file).name))

  // let's load
  try {
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
      command.loadState = 'ok'
      command.errorState = 'none'
      command.run = commandModule
    } else {
      command.loadState = 'error'
      command.errorState = 'badfunction'
    }
  } catch (e) {
    command.exception = e
    command.loadState = 'error'
    command.errorState = 'badfile'
  }

  return command
}

module.exports = loadFromFile
