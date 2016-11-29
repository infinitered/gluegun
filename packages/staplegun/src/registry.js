// @flow
import type { Registry, Filter, Script, Plugin } from '../types'
import { loadPlugin } from './plugin'

/**
 * Create a registry which holds user-defined customizations.
 *
 * @export
 * @returns {Registry}
 */
export function createRegistry (): Registry {
  const filters: Array<Filter> = []
  const scripts: Array<Script> = []
  const plugins: Array<Plugin> = []
  const invalidPlugins: Array<Plugin> = []

  /**
   * Loads a plugin from the given path. Ignore dups.
   */
  function load (path: string): Plugin|null {
    try {
      // try loading the plugin
      const plugin: Plugin = loadPlugin(path)

      // was this plugin loaded?
      if (plugin.status === 'Loaded') {
        plugins.push(plugin)
      } else {
        invalidPlugins.push(plugin)
      }

      return plugin
    } catch (e) {
      // crap... TODO: log that the plugin had an error?
      return null
    }
  }

  return {
    filters,
    scripts,
    plugins,
    invalidPlugins,
    load
  }
}
