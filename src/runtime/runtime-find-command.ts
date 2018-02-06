import { equals, last } from 'ramda'

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
  const rest = commandPath.slice()

  // we loop through each segment of the commandPath, looking for aliases among
  // parent commands, and expand those.
  const foundCommands = commandPath.reduce((prevCommands: Command[], currName: string) => {
    // what is the path for the last known command?
    const lastCommand = last(prevCommands)
    const prevPath = lastCommand ? lastCommand.commandPath : []

    // find a command that fits the previous path + currentName, which can be an alias
    let segmentCommand = runtime.commands
      .sort(sortCommands)
      .find(command => equals(command.commandPath.slice(0, -1), prevPath) && command.matchesAlias(currName))

    if (segmentCommand) {
      // remove another segment from the commandPath
      rest.shift()
      // add the new command to the path
      return prevCommands.concat([segmentCommand])
    } else {
      // didn't find a command that fit this description
      return prevCommands
    }
  }, [])

  // the last command is the one we run
  // if no targetCommand found, use the default (if set)
  let targetCommand = last(foundCommands) || runtime.defaultCommand

  return { command: targetCommand, array: rest }
}

// sorts shortest to longest commandPaths, so we always check the shortest ones first
function sortCommands(a, b) {
  return a.commandPath.length < b.commandPath.length ? -1 : 1
}
