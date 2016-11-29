// @flow
import type { Plugin } from '../types'
import { throwWith, isNotString } from './utils'
import { is, isNil, map, pipe, without } from 'ramda'
import shell from 'shelljs'

shell.config.silent = true

// the mask to use when searching for plugins in a directory
const PLUGIN_FILE_GLOB = '*.js'

// is this file missing?
const isFileMissing = path => !shell.test('-e', path)

// is this a directory
const isNotDirectory = path => !shell.test('-d', path)

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
  shell.pushd(path)
  const dirs = shell.ls(PLUGIN_FILE_GLOB).map(x => `${path}/${x}`)
  shell.popd()
  return dirs
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
