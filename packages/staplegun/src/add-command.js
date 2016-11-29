// @flow
import type { Command, Plugin } from '../types'
import { find, where, equals } from 'ramda'
import { throwWith, isBlank, isnt } from './utils'

/**
 * Creates a function, that adds a command from a plugin into our list of commands.
 */
export default function createAddCommand (plugin: Plugin, commands: Array<Command>): Function {
  return function addCommand (name: string, fn: Function): void {
    // sanity
    throwWith('command name cannot be blank', isBlank, name)
    throwWith('command must be a function', isnt(Function), fn)

    // prevent a 2nd command with the same name
    const dupe = find(where({ plugin: equals(plugin), name: equals(name) }))(commands)
    if (dupe) {
      // TODO: warn somewhere, somehow
      throw new Error(`the command called ${name} already exists in the plugin ${plugin.path}`)
    }

    // create the command
    const command: Command = {
      name,  // the command's name (must be unique within the plugin)
      fn,    // the function that fires
      plugin // the plugin who spawned us
    }

    // add this command to registry
    commands.push(command)
  }
}
