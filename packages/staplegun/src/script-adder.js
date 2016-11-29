// @flow
import type { Script, Plugin } from '../types'
import { find, where, equals } from 'ramda'
import { throwWith, isBlank, isnt } from './utils'

/**
 * Creates a function, that adds a script from a plugin into our list of scripts.
 */
export default function createScriptAdded (plugin: Plugin, scripts: Array<Script>): Function {
  return function addScript (name: string, handler: Function): void {
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
  }
}
