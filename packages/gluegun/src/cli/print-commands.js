const print = require('../utils/print')
const {
  pipe,
  isNil,
  map,
  sortBy,
  prop,
  T,
  propEq,
  propSatisfies,
  reject,
  cond,
  always,
  replace,
  concat,
  head
} = require('ramda')
const { dotPath } = require('ramdasauce')
const { isBlank } = require('../utils/string-utils')

/**
 * Does this have a loadState error?
 */
const hasLoadStateError = propEq('loadState', 'error')

/**
 * Prints the list of commands.
 *
 * @param {RunContext} context     The context that was used
 */
function printCommands (context) {
  const isInvalidName =
    isNil(context.plugin) && !isBlank(context.parameters.pluginName)
  const isInvalidCommand =
    isNil(context.command) && !isBlank(context.parameters.pluginName) && !isBlank(context.parameters.rawCommand)

  // was there user error involved?
  if (isInvalidName) {
    print.info(`${context.runtime.brand} '${context.parameters.pluginName}' is not a command.`)
  } else if (isInvalidCommand) {
    print.info(`${context.runtime.brand} ${context.parameters.pluginName} '${context.parameters.rawCommand}' is not a command.`)
  }

  // the columns to display when we don't have a name
  const dataForName = pipe(
    dotPath('runtime.plugins'),
    reject(hasLoadStateError),
    // don't list the context.defaultPlugin itself when we're running in plugin mode
    reject(plugin => context.defaultPlugin && context.defaultPlugin.name === plugin.name),
    sortBy(prop('name')),
    map(plugin => [
      plugin.name,
      replace('$BRAND', context.runtime.brand, plugin.description || '-')
    ]),
    data => {
      if (context.defaultPlugin) {
        return pipe(
          reject(hasLoadStateError),
          map(command => [
            command.name,
            replace('$BRAND', context.runtime.brand, command.description || '-')
          ]),
          concat(data)
        )(context.defaultPlugin.commands)
      } else {
        return data
      }
    },
    sortBy(head)
    )

  // the columns to display when we don't have a command
  const dataForCommand = pipe(
    dotPath('plugin.commands'),
    reject(hasLoadStateError),
    map(command => [
      command.name,
      replace('$BRAND', context.runtime.brand, command.description || '-')
    ])
    )

  // decide what set of data to show
  const data = cond([
    // should we show the list of names?
    [propSatisfies(isNil, 'plugin'), dataForName],

    // should we show the list of commands in a plugin?
    [propSatisfies(isNil, 'command'), dataForCommand],

    // should never get here
    [T, always([])]
  ])(context)

  print.newline()

  print.table(data)
}

module.exports = printCommands
