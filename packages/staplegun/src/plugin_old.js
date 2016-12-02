// @flow
import type { Plugin } from '../types'
import { throwWith, isNotString } from './utils'
import { is, isNil, map, pipe, without } from 'ramda'
import jetpack from 'fs-jetpack'

// is this file missing?
const isFileMissing = path => !jetpack.exists(path)

// is this a directory
const isNotDirectory = path => jetpack.exists(path) !== 'dir'

// try loading this module
function getPluginInitializer (path: string): ?Function {
  try {
    require.resolve(path)
    return require(path).default
  } catch (e) {
    return null
  }
}

/**
 * Creates a plugin.
 *
 * @param {string} path - The full path to the plugin.
 * @returns {Plugin}
 */
export function loadPlugin (path: string): Plugin {
  // sanity
  throwWith('path is required', isNil, path)
  throwWith('path must be a string', isNotString, path)

  // TODO: load the config
  const config = {}
  const plugin: Plugin = {
    config,
    path,
    initializer: null,
    error: null,
    errorMessage: null,
    status: 'Error'
  }

  // is the file missing?
  if (isFileMissing(path)) {
    plugin.status = 'Error'
    plugin.error = 'Missing'
  } else {
    // attempt to load the plugin
    plugin.initializer = getPluginInitializer(path)
    // did we load it properly?
    if (is(Function, plugin.initializer)) {
      plugin.status = 'Loaded'
    } else {
      plugin.status = 'Error'
      plugin.error = 'Invalid'
    }
  }

  return plugin
}

/**
 * Gets the names of the files in the given directory.
 */
function getFiles (path: string): Array<string> {
  return jetpack
    .cwd(path)
    .find({ matching: '*.js', recursive: false })
}

/**
 * Loads all the plugins in the given directory.
 *
 * @export
 * @param {string} path - The path to search
 * @returns {Array<Plugin>}
 */
export function loadPluginDirectory (path: string): Array<Plugin> {
  // sanity
  throwWith('directory path is required', isNil, path)
  throwWith('directory path must be a string', isNotString, path)
  throwWith('directory path must be a string', isNotDirectory, path)
  //  grab all the files
  return pipe(
    map(pluginPath => { try { return loadPlugin(pluginPath) } catch (e) { return null } }),
    without([null])
  )(getFiles(path))
}

/**
 * Creates a loaded plugin, great for testing.
 */
export function createLoadedPlugin (initializer :Function): Plugin {
  return {
    initializer,
    config: {},
    path: '/tmp/whatever',
    error: null,
    errorMessage: null,
    status: 'Loaded'
  }
}
