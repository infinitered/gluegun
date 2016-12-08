const print = require('../utils/print')
const { map } = require('ramda')

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

    // the error state of the command
    const commandErrorState = command.errorState === 'none'
      ? print.colors.success('ok')
      : print.colors.error(command.errorState)

    const col1 = runtime.brand !== 'gluegun' && runtime.brand === plugin.namespace
      ? `${command.name}`
      : `${plugin.namespace} ${command.name}`

    return [
      print.colors.highlight(col1),
      command.description,
      commandErrorState
    ]
  }, commands)

  // print the table
  print.table(data)

  print.newline()
}

module.exports = printCommands
