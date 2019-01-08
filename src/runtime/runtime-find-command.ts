import { Command } from '../domain/command'
import { Runtime } from './runtime'
import { GluegunParameters, GluegunToolbox } from '../domain/toolbox'
import { equals } from '../toolbox/utils'

/**
 * This function performs some somewhat complex logic to find a command for a given
 * set of parameters and plugins.
 *
 * @param runtime The current runtime.
 * @param parameters The parameters passed in
 * @returns object with plugin, command, and array
 */
export function findCommand(runtime: Runtime, parameters: GluegunParameters): { command: Command; array: string[] } {
  // the commandPath, which could be something like:
  // > movie list actors 2015
  // [ 'list', 'actors', '2015' ]
  // here, the '2015' might not actually be a command, but it's part of it
  const commandPath = parameters.array

  // the part of the commandPath that doesn't match a command
  // in the above example, it will end up being [ '2015' ]
  let tempPathRest = commandPath
  let commandPathRest = tempPathRest

  // a fallback command
  const commandNotFound = new Command({
    run: (toolbox: GluegunToolbox) => {
      throw new Error(`Couldn't find that command, and no default command set.`)
    },
  })

  // the resolved command will live here
  // start by setting it to the default command, in case we don't find one
  let targetCommand: Command = runtime.defaultCommand || commandNotFound

  // if the commandPath is empty, it could be a dashed command, like --help
  if (commandPath.length === 0) {
    targetCommand = findDashedCommand(runtime.commands, parameters.options) || targetCommand
  }

  // store the resolved path as we go
  let resolvedPath: string[] = []

  // we loop through each segment of the commandPath, looking for aliases among
  // parent commands, and expand those.
  commandPath.forEach((currName: string) => {
    // cut another piece off the front of the commandPath
    tempPathRest = tempPathRest.slice(1)

    // find a command that fits the previous path + currentName, which can be an alias
    let segmentCommand = runtime.commands
      .slice() // dup so we keep the original order
      .sort(sortCommands)
      .find(command => equals(command.commandPath.slice(0, -1), resolvedPath) && command.matchesAlias(currName))

    if (segmentCommand) {
      // found another candidate as the "endpoint" command
      targetCommand = segmentCommand

      // since we found a command, the "commandPathRest" gets updated to the tempPathRest
      commandPathRest = tempPathRest

      // add the current command to the resolvedPath
      resolvedPath = resolvedPath.concat([segmentCommand.name])
    } else {
      // no command found, let's add the segment as-is to the command path
      resolvedPath = resolvedPath.concat([currName])
    }
  }, [])

  return { command: targetCommand, array: commandPathRest }
}

// sorts shortest to longest commandPaths, so we always check the shortest ones first
function sortCommands(a, b) {
  return a.commandPath.length < b.commandPath.length ? -1 : 1
}

// finds dashed commands
function findDashedCommand(commands, options) {
  const dashedOptions = Object.keys(options).filter(k => options[k] === true)
  return commands.filter(c => c.dashed).find(c => c.matchesAlias(dashedOptions))
}
