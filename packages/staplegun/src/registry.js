// @flow
import type { Registry, Filter, Script, Plugin, Command } from '../types'
import { loadPlugin } from './plugin'
import { findByProp } from 'ramdasauce'
import createAddScript from './add-script'
import createAddCommand from './add-command'
import createAddFilter from './add-filter'
import { throwWith, isBlank } from './utils'

/**
 * Create a registry which holds user-defined customizations.
 *
 * @export
 * @returns {Registry}
 */
export function createRegistry (namespace: string): Registry {
  throwWith('registry namespace cannot be blank', isBlank, namespace)

  const filters: Array<Filter> = []
  const scripts: Array<Script> = []
  const plugins: Array<Plugin> = []
  const commands: Array<Command> = []

  const invalidPlugins: Array<Plugin> = []

  /**
   * Initialize the plugin to give it chance to register it's capabilities.
   */
  function initializePlugin (plugin: Plugin): void {
    // plugins will receive this when they get initialized
    const context = {
      addScript: createAddScript(plugin, scripts),   // when we find a script
      addCommand: createAddCommand(plugin, commands), // when we find a command
      addFilter: createAddFilter(plugin, filters) // when we find a filter
    }

    // ok, let's do this!
    if (plugin.initializer) {
      plugin.initializer(context)
    }
  }

  /**
   * Use this plugin.
   */
  function use (plugin: Plugin): void {
    // was this plugin loaded?
    if (plugin.status === 'Loaded') {
      try {
        initializePlugin(plugin)
        plugin.status = 'Initialized'
        plugins.push(plugin)
      } catch (e) {
        plugin.errorMessage = e.message
        plugin.status = 'Error'
        plugin.error = 'Initialize'
        invalidPlugins.push(plugin)
      }
    } else {
      invalidPlugins.push(plugin)
    }
  }

  /**
   * Loads a plugin from the given path. Ignore dups.
   */
  function useFromFile (path: string): Plugin|null {
    // check for duplicate plugins
    if (findByProp('path', path, plugins)) {
      // TODO: log an error or something, but not horrible to just ignore
      return null
    }
    try {
      // try loading the plugin
      const plugin: Plugin = loadPlugin(path)
      use(plugin)
      return plugin
    } catch (e) {
      return null
    }
  }

  return {
    namespace,
    filters,
    scripts,
    commands,
    plugins,
    invalidPlugins,
    use,
    useFromFile
  }
}
