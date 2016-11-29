// @flow
import type { Registry, Filter, Script, Plugin } from '../types'
import { loadPlugin } from './plugin'
import { curry, find, where, equals } from 'ramda'
import { findByProp } from 'ramdasauce'
import { isBlank, throwWith, isnt } from './utils'

/**
 * Create a registry which holds user-defined customizations.
 *
 * @export
 * @returns {Registry}
 */
export function createRegistry (): Registry {
  let filters: Array<Filter> = []
  let scripts: Array<Script> = []
  let plugins: Array<Plugin> = []
  let invalidPlugins: Array<Plugin> = []

  /**
   * Add this script to the registry.
   */
  const addScript = curry(
    function addScript (plugin: Plugin, name: string, handler: Function): Script|void {
      // sanity
      throwWith('script name cannot be blank', isBlank, name)
      throwWith('handler must be a function', isnt(Function), handler)

      // prevent a 2nd script with the same name
      const dupe = find(where({ plugin: equals(plugin), name: equals(name) }))(scripts)
      if (dupe) {
        // TODO: warn somewhere, somehow
        throw new Error(`the script called ${name} already exists in the plugin ${plugin.path}`)
      }

      // the plugin's config may contain a section for this script
      const config = plugin.config[name] || {}

      // create thes script object
      const script: Script = {
        name,    // the script's name (must be unique within the plugin)
        handler, // the function that fires
        plugin,  // the plugin who spawned us
        config   // any configuration for this script
      }

      // add this script to registry
      scripts.push(script)
      return script
    }
  )

  /**
   * Initialize the plugin to give it chance to register it's capabilities.
   */
  function initializePlugin (plugin: Plugin): void {
    // the object to pass into the plugin to initialize it
    const context = {
      addScript: addScript(plugin) // allows the plugin to register a script
    }
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
