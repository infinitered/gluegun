import { equals } from 'ramda'

import { Command } from '../domain/command'
import { Runtime } from './runtime'
import { RunContextParameters } from '../domain/run-context'

/**
 * This function performs some somewhat complex logic to find a command for a given
 * set of parameters and plugins.
 *
 * @param runtime The current runtime.
 * @param parameters The parameters passed in
 * @returns object with plugin, command, and array
 */
export function findCommand(runtime: Runtime, parameters: RunContextParameters) {
  // the commandPath, which could be something like:
  // > movie list actors 2015
  // [ 'list', 'actors', '2015' ]
  // here, the '2015' might not actually be a command, but it's part of it
  const commandPath = parameters.array

  // the part of the commandPath that doesn't match a command
  // in the above example, it will end up being [ '2015' ]
  let commandPathRest = commandPath.slice()
  let rest = commandPathRest

  // the resolved command will live here
  // start by setting it to the default command, in case we don't find one
  let targetCommand: Command = runtime.defaultCommand

  // we loop through each segment of the commandPath, looking for aliases among
  // parent commands, and expand those.
  commandPath.reduce((prevPath: string[], currName: string) => {
    // cut another piece off the front of the commandPath
    commandPathRest = commandPathRest.slice(1)

    // find a command that fits the previous path + currentName, which can be an alias
    let segmentCommand = runtime.commands
      .sort(sortCommands)
      .find(command => equals(command.commandPath.slice(0, -1), prevPath) && command.matchesAlias(currName))

    if (segmentCommand) {
      // found another candidate as the "endpoint" command
      targetCommand = segmentCommand

      // since we found a command, the "rest" gets updated to the commandPathRest
      rest = commandPathRest

      // add the current command to the prevPath
      prevPath = prevPath.concat([segmentCommand.name])
    } else {
      // no command found, let's add the segment as-is to the command path
      prevPath = prevPath.concat([currName])
    }

    return prevPath
  }, [])

  return { command: targetCommand, array: rest }
}

// sorts shortest to longest commandPaths, so we always check the shortest ones first
function sortCommands(a, b) {
  return a.commandPath.length < b.commandPath.length ? -1 : 1
}
