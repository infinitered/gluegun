const print = require('./print')
const { pipe, map, sortBy, prop, propEq, reject, replace, unnest, equals } = require('ramda')

/**
 * Is this a hidden command?
 */
const isHidden = propEq('hidden', true)

/**
 * Gets the list of plugins.
 *
 * @param {RunContext} context     The context
 * @param {Plugin[]} plugins       The plugins holding the commands
 * @param {string[]} commandRoot   Optional, only show commands with this root
 * @return {[string, string]}
 */
function getListOfPluginCommands (context, plugins, commandRoot) {
  return pipe(
    reject(isHidden),
    sortBy(prop('name')),
    map(p => getListOfCommands(context, p, commandRoot)),
    unnest
  )(plugins)
}

/**
 * Gets the list of commands for the given plugin.
 *
 * @param {RunContext} context     The context
 * @param {Plugin} plugin          The plugins holding the commands
 * @param {string[]} commandRoot   Optional, only show commands with this root
 * @return {[string, string]}
 */
function getListOfCommands (context, plugin, commandRoot) {
  return pipe(
    reject(isHidden),
    reject(command => {
      if (!commandRoot) {
        return false
      }
      return !equals(command.commandPath.slice(0, commandRoot.length), commandRoot)
    }),
    map(command => {
      const alias = command.hasAlias() ? `(${command.aliases.join(', ')})` : ''
      return [
        `${command.commandPath.join(' ')} ${alias}`,
        replace('$BRAND', context.runtime.brand, command.description || '-')
      ]
    })
  )(plugin.commands)
}

/**
 * Prints the list of commands.
 *
 * @param {RunContext} context     The context that was used
 * @param {string[]} commandRoot   Optional, only show commands with this root
 */
function printCommands (context, commandRoot) {
  let printPlugins = []
  if (context.plugin === context.defaultPlugin) {
    // print for all plugins
    printPlugins = context.plugins
  } else {
    // print for one plugin
    printPlugins = [context.plugin]
  }

  const data = getListOfPluginCommands(context, printPlugins, commandRoot)

  print.newline() // a spacer
  print.table(data) // the data
}

function printHelp (context) {
  const { print, runtime: { brand } } = context
  print.info(`${brand} version ${context.version()}`)
  print.printCommands(context)
}

module.exports = { printHelp, printCommands }
