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
 * @param {Plugin}     brandPlugin The branded plugin used
 */
function printCommands (context, brandPlugin) {
  const isInvalidNamespace =
    isNil(context.plugin) && !isBlank(context.parameters.namespace)
  const isInvalidCommand =
    isNil(context.command) && !isBlank(context.parameters.namespace) && !isBlank(context.parameters.full)

  // was there user error involved?
  if (isInvalidNamespace) {
    print.info(`${context.runtime.brand} '${context.parameters.namespace}' is not a command.`)
  } else if (isInvalidCommand) {
    print.info(`${context.runtime.brand} ${context.parameters.namespace} '${context.parameters.full}' is not a command.`)
  }

  // the columns to display when we don't have a namespace
  const dataForNamespace = pipe(
    dotPath('runtime.plugins'),
    reject(hasLoadStateError),
    // don't list the brandPlugin itself when we're running in plugin mode
    reject(plugin => brandPlugin && brandPlugin.namespace === plugin.namespace),
    sortBy(prop('namespace')),
    map(plugin => [plugin.namespace, plugin.description || '-']),
    data => {
      if (brandPlugin) {
        return pipe(
          reject(hasLoadStateError),
          map(command => [command.name, command.description || '-']),
          concat(data)
        )(brandPlugin.commands)
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
    map(command => [command.name, command.description || '-'])
    )

  // decide what set of data to show
  const data = cond([
    // should we show the list of namespaces?
    [propSatisfies(isNil, 'plugin'), dataForNamespace],

    // should we show the list of commands in a plugin?
    [propSatisfies(isNil, 'command'), dataForCommand],

    // should never get here
    [T, always([])]
  ])(context)

  print.newline()

  print.table(data)
}

module.exports = printCommands
