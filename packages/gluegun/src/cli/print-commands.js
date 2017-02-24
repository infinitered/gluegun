const print = require('../utils/print')
const {
  pipe,
  isNil,
  map,
  sortBy,
  prop,
  propEq,
  reject,
  replace
} = require('ramda')
const { dotPath } = require('ramdasauce')
const { isBlank } = require('../utils/string-utils')

/**
 * Does this have a loadState error?
 */
const hasLoadStateError = propEq('loadState', 'error')

/**
 * Is this a hidden command?
 */
const isHidden = propEq('hidden', true)

/**
 * Gets the list of plugins.
 *
 * @param {RunContext} context
 * @return {[string, string]}
 */
function getListOfPlugins (context) {
  return pipe(
    dotPath('runtime.plugins'),
    reject(hasLoadStateError),
    reject(isHidden),
    reject(
      plugin =>
        context.runtime.defaultPlugin &&
        context.runtime.defaultPlugin.name === plugin.name
    ),
    sortBy(prop('name')),
    map(plugin => [
      plugin.name,
      replace('$BRAND', context.runtime.brand, plugin.description || '-')
    ])
  )(context)
}

/**
 * Gets the list of commands for the given plugin.
 *
 * @param {RunContext} context  The context
 * @param {Plugin} plugin       The plugins holding the commands
 * @return {[string, string]}
 */
function getListOfCommands (context, plugin) {
  return pipe(
    prop('commands'),
    reject(hasLoadStateError),
    reject(isHidden),
    map(command => {
      const alias = command.alias ? `(${command.alias})` : ''
      return [
        `${command.name} ${alias}`,
        replace('$BRAND', context.runtime.brand, command.description || '-')
      ]
    })
  )(plugin)
}

/**
 * Prints the list of commands.
 *
 * @param {RunContext} context     The context that was used
 */
function printCommands (context) {
  // jet if we've got both a plugin & a command
  if (context.plugin && context.command) return

  const noPlugin = isNil(context.plugin)
  const noCommand = isNil(context.command)
  const searchedforPlugin = !isBlank(context.parameters.pluginName)
  const searchedforCommand = !isBlank(context.parameters.rawCommand)

  // was there user error involved?
  let errorMessage = null
  if (searchedforPlugin && noPlugin) {
    errorMessage = `${context.runtime.brand} '${context.parameters.pluginName}' is not a command.`
  } else if (searchedforCommand && noCommand) {
    errorMessage = `${context.runtime.brand} ${context.parameters.pluginName} '${context.parameters.rawCommand}' is not a command.`
  }

  let data = []
  if (noPlugin) {
    data = getListOfPlugins(context)
    if (context.runtime.defaultPlugin) {
      const defaultCommands = getListOfCommands(
        context,
        context.runtime.defaultPlugin
      )
      data = data.concat(defaultCommands)
    }
  } else if (noCommand) {
    data = getListOfCommands(context, context.plugin)
  }

  print.newline() // a spacer
  print.table(data) // the data
  if (errorMessage) {
    print.newline()
    print.error(errorMessage)
  }
}

module.exports = printCommands
