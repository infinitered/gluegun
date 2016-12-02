// @flow
import autobind from 'autobind-decorator'
import Plugin from './plugin'
import { append, forEach } from 'ramda'

/**
 * Loads plugins an action through the gauntlet.
 */
@autobind
class Runtime {

  plugins = []

  /**
   * Adds a plugin.
   */
  addPlugin (plugin: Plugin): void {
    this.plugins = append(plugin, this.plugins)
  }

  /**
   * Loads a plugin from a directory.
   */
  addPluginFromDirectory (directory: string): Plugin|void {
    const plugin = new Plugin()
    plugin.loadFromDirectory(directory)
    this.addPlugin(plugin)
    return plugin
  }

  /**
   * Returns a list of commands for printing
   */
  listCommands () {
    const commands = []
    const eachPlugin = plugin => {
      const eachCommand = command => {
        commands.push({
          plugin: plugin.namespace,
          command: command.name,
          description: command.description
        })
      }
      forEach(eachCommand, plugin.commands)
    }
    forEach(eachPlugin, this.plugins)
    return commands
  }

  /**
   * Runs a command.
   */
  run (
    namespace: string,
    args: string[] = [],
    opts: any = {}
  ): void {

  }
}

export default Runtime
