// @flow
import type { Filter, Plugin } from '../types'
import { find, where, equals } from 'ramda'
import { throwWith, isBlank, isnt } from './utils'

/**
 * Creates a function, that adds a filter from a plugin into our list of filters.
 */
export default function createAddFilter (plugin: Plugin, filters: Array<Filter>): Function {
  return function addFilter (name: string, fn: Function): void {
    // sanity
    throwWith('filter name cannot be blank', isBlank, name)
    throwWith('filter must be a function', isnt(Function), fn)

    // prevent a 2nd filter with the same name
    const dupe = find(where({ plugin: equals(plugin), name: equals(name) }))(filters)
    if (dupe) {
      // TODO: warn somewhere, somehow
      throw new Error(`the filter called ${name} already exists in the plugin ${plugin.path}`)
    }

    // create the filter
    const filter: Filter = {
      name,  // the filter's name (must be unique within the plugin)
      fn,    // the function that fires
      plugin // the plugin who spawned us
    }

    // add this filter to registry
    filters.push(filter)
  }
}
