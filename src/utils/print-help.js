const print = require('./print')
const { commandInfo } = require('./command-info')

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

  const data = commandInfo(context, printPlugins, commandRoot)

  print.newline() // a spacer
  print.table(data) // the data
}

function printHelp (context) {
  const { print, runtime: { brand } } = context
  print.info(`${brand} version ${context.meta.version()}`)
  print.printCommands(context)
}

module.exports = { printHelp, printCommands }
