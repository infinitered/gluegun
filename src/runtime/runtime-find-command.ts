import { Command } from '../domain/command'
import { Runtime } from './runtime'
import { GluegunToolbox } from '../domain/toolbox'
import { equals } from '../toolbox/utils'

/**
 * This function performs some somewhat complex logic to find a command for a given
 * set of parameters and plugins.
 *
 * @param runtime The current runtime.
 * @param args Command, options and parameters as string array.
 * @returns object with plugin, command, array, and args
 */
export function findCommand(runtime: Runtime, args: string[]): { command: Command; args: string[] } {
  // the commandPath, which could be something like:
  // > movie list actors 2015
  // [ 'list', 'actors', '2015' ]
  // here, the '2015' might not actually be a command, but it's part of it
  const commandPath = args

  // the part of the commandPath that doesn't match a command
  // in the above example, it will end up being [ '2015' ]
  let pathRest = commandPath
  let outputArgs = []
  let potentialOptionValue = false

  // a fallback command
  const commandNotFound = new Command({
    run: (toolbox: GluegunToolbox) => {
      throw new Error(`Couldn't find that command, and no default command set.`)
    },
  })

  // the resolved command will live here
  // start by setting it to the default command, in case we don't find one
  let targetCommand: Command = runtime.defaultCommand || commandNotFound

  // if there were no args, return the fallback command
  if (commandPath.length === 0) {
    return { command: runtime.defaultCommand || commandNotFound, args: [] }
  }

  // store the resolved path as we go
  let resolvedPath: string[] = []

  // we loop through each segment of the commandPath, looking for aliases among
  // parent commands, and expand those.
  commandPath.forEach((currName: string) => {
    console.log('CURR NAME', currName)

    // cut another piece off the front of the commandPath
    pathRest = pathRest.slice(1)

    if (currName.startsWith('-')) {
      outputArgs.push(currName)
      potentialOptionValue = true
    } else {
      let prefix = [...resolvedPath, currName]

      // find a command that matches the path prefix so far + currName (which may be an alias)
      let commandWithPrefix = runtime.commands
        .slice() // dup so we keep the original order
        .sort(sortCommands)
        .find(command => commandHasPrefix(command, prefix))

      console.log('COMMAND WITH PREFIX', commandWithPrefix)
      console.log('PATH REST', pathRest)

      if (commandWithPrefix) {
        // make sure we don't mistake option values for commands, i.e.,
        // for `--some-option cmd cmd` treat the first `cmd` as the option
        // value and the second as a command path segment
        if (potentialOptionValue) {
          if (pathRest.slice(1, 1) === [currName]) {
            console.log('PUSH TO ARGS', currName)
            outputArgs.push(currName)
          } else {
            console.log('PUSH TO RESOLVED PATH', commandWithPrefix.commandPath[prefix.length - 1])
            resolvedPath.push(commandWithPrefix.commandPath[prefix.length - 1])
          }
        } else {
          console.log('PUSH TO RESOLVED PATH', commandWithPrefix.commandPath[prefix.length - 1])
          resolvedPath.push(commandWithPrefix.commandPath[prefix.length - 1])
        }
      } else {
        console.log('PUSH TO ARGS', currName)
        // no command includes currName in its prefix, assume it's an option value
        outputArgs.push(currName)
      }

      potentialOptionValue = false
    }
  }, [])

  console.log('RESOLVED PATH:', resolvedPath)
  console.log('OUTPUT ARGS:', outputArgs)

  targetCommand =
    findCommandWithPath(runtime.commands, resolvedPath) ||
    findDashedCommand(runtime.commands, outputArgs) ||
    runtime.defaultCommand ||
    commandNotFound

  return { command: targetCommand, args: outputArgs }
}

// sorts shortest to longest commandPaths, so we always check the shortest ones first
function sortCommands(a, b) {
  return a.commandPath.length < b.commandPath.length ? -1 : 1
}

// returns true if the command has the given path prefix
function commandHasPrefix(command: Command, prefix: string[]): boolean {
  console.log('COMMAND HAS PREFIX', command.commandPath, command.aliases, prefix)

  if (prefix.length > command.commandPath.length) {
    return false
  }

  for (let i = 0; i < prefix.length - 1; i++) {
    if (command.commandPath[i] !== prefix[i]) {
      return false
    }
  }

  if (command.commandPath[prefix.length - 1] === prefix[prefix.length - 1]) {
    return true
  }

  if (command.matchesAlias(prefix[prefix.length - 1])) {
    return true
  }

  return false
}

// finds the command that matches the given path
function findCommandWithPath(commands: Command[], commandPath: string[]): Command | undefined {
  return commands.find(command => equals(command.commandPath, commandPath))
}

// finds dashed commands
function findDashedCommand(commands, args) {
  const names = args.filter(a => a.startsWith('-')).map(a => a.replace(/^-+/, '').replace(/=.*$/, ''))
  console.log('FIND DASHED COMMANDS:', names)
  return commands.filter(c => c.dashed).find(c => c.matchesAlias(names))
}
