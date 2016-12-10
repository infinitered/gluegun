const print = require('../utils/print')
const { map, propEq, reject } = require('ramda')

/**
 * Does this have a loadState error?
 */
const hasLoadStateError = propEq('loadState', 'error')

/**
 * Does this plugin have any problems?
 *
 * @param  {{}}   item The listCommand item
 * @return {bool}          `true` if problems otherwise `false`
 */
const hasProblem = item => hasLoadStateError(item.command)

/**
 * Prints the list of commands.
 *
 * @param {Runtime} runtime The runtime to grab the commands from.
 */
function printCommands (runtime) {
  print.newline()

  // grab the commands
  const commands = runtime.listCommands()

  // assemble a table for printing
  const data = map(line => {
    const { plugin, command } = line

    const col1 = runtime.brand !== 'gluegun' && runtime.brand === plugin.namespace
      ? `${command.name}`
      : `${plugin.namespace} ${command.name}`

    return [
      print.colors.highlight(col1),
      command.description
    ]
  }, reject(hasProblem, commands))

  // print the table
  print.table(data)

  print.newline()
}

module.exports = printCommands
