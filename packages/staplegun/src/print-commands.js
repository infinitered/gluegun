// @flow
import print from './print'
import Runtime from './runtime'
import { equals, map } from 'ramda'

/**
 * Prints the list of commands.
 */
export default function printCommands (runtime: Runtime) {
  print.newline()

  const commands = runtime.listCommands()

  const data = map(line => {
    const { plugin, command } = line

    //
    const commandErrorState = command.errorState === 'none'
      ? print.colors.success('ok')
      : print.colors.error(command.errorState)

    return [
      print.colors.highlight(`${plugin.namespace} ${command.name}`),
      command.description,
      commandErrorState
    ]
  }, commands)

  print.table(data)

  print.newline()
}
