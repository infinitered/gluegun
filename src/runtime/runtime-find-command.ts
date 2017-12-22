import { equals, find, isNil, reduce, sort } from 'ramda'
import { isNilOrEmpty } from 'ramdasauce'

import Command from '../domain/command'
import Plugin from '../domain/plugin'
import Runtime from './runtime'

/**
 * This function performs some somewhat complex logic to find a command for a given
 * set of parameters and plugins.
 *
 * @param {Runtime} runtime The current runtime.
 * @param {any} parameters The parameters passed in
 * @returns { plugin: Plugin|null, command: Command|null, array: string[] }
 */
export function findCommand (
  runtime: Runtime,
  parameters: any,
): { plugin: Plugin | null; command: Command | null; array: string[] } {
  let rest: string[]
  let targetCommand: Command

  const commandPath: string[] = parameters.array

  // sort the default plugin to the front
  const otherPlugins = runtime.plugins.filter(p => p !== runtime.defaultPlugin)
  const plugins = [runtime.defaultPlugin, ...otherPlugins].filter(p => !isNil(p))

  // loop through each plugin, looking for a command that matches the parameters
  const targetPlugin = find((plugin: Plugin) => {
    // if the plugin doesn't have any commands, we can skip it
    if (isNil(plugin) || isNilOrEmpty(plugin.commands)) {
      return false
    }

    // track the rest of the commandPath as we traverse
    rest = commandPath.slice() // dup

    // traverse through the command path, retrieving aliases along the way
    // and get a nice commandPath we can use to check for a matching command
    const finalCommandPath = reduce((prevPath, currName) => {
      // find a command that fits the previous path + currentName, which can be an alias
      const cmd = find(
        command => {
          return equals(command.commandPath.slice(0, -1), prevPath) && command.matchesAlias(currName)
        },
        // sorted shortest path to longest
        sort((a, b) => a.commandPath.length - b.commandPath.length, plugin.commands),
      )

      if (cmd) {
        rest.shift() // remove the current item
        return cmd.commandPath
      } else {
        return prevPath
      }
    }, [])(commandPath)

    // we don't actually have a command path
    if (finalCommandPath.length === 0) {
      // if we're not looking down a command path, look for dashed commands or a default command
      const dashedOptions = Object.keys(parameters.options).filter(k => parameters.options[k] === true)

      // go find a command that matches the dashed command or a default
      targetCommand = find(command => {
        // dashed commands, like --version or -v
        const dashMatch = command.dashed && command.matchesAlias(dashedOptions)
        const isDefault = equals(command.commandPath, [plugin.name])
        return dashMatch || isDefault
      }, plugin.commands)
    } else {
      // look for a command that matches this commandPath
      targetCommand = find(command => equals(command.commandPath, finalCommandPath), plugin.commands)
    }

    // Did we find the targetCommand?
    return Boolean(targetCommand)
  }, plugins)

  return { plugin: targetPlugin, command: targetCommand, array: rest }
}
