// @flow
import type { Registry, Filter, Script, Plugin } from '../types'
import { loadPlugin } from './plugin'
import { findByProp } from 'ramdasauce'
import createScriptAdder from './script-adder'

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
   * Initialize the plugin to give it chance to register it's capabilities.
   */
  function initializePlugin (plugin: Plugin): void {
    // plugins will receive this when they get initialized
    const context = {
      addScript: createScriptAdder(plugin, scripts) // when we find a script
    }

    // ok, let's do this!
    if (plugin.initializer) {
      plugin.initializer(context)
    }
  }

  /**
   * Removes the plugin and all dependencies.
   */
  // function unload (plugin: Plugin): void {
  //   plugins = without([plugin])
  //   scripts = reject(propEq('plugin', plugin), scripts)
  //   filters = reject(propEq('plugin', plugin), filters)
  // }

  /**
   * Loads a plugin from the given path. Ignore dups.
   */
  function load (path: string): Plugin|null {
    // check for duplicate plugins
    if (findByProp('path', path, plugins)) {
      // TODO: log an error or something, but not horrible to just ignore
      return null
    }

    try {
      // try loading the plugin
      const plugin: Plugin = loadPlugin(path)

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
