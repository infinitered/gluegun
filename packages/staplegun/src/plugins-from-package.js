// @flow
import jetpack from 'fs-jetpack'
import { isNilOrEmpty, dotPath } from 'ramdasauce'
import { keys, map, when, always, pipe } from 'ramda'

/**
 * Gets a list of directories paths for the staplegun plugins
 * listed in the package.json.
 * @param  {?string}  directory The starting directory
 * @return {string[]}             A list of directories.
 */
function getPluginDirectoriesFromPackage (directory: ?string): string[] {
  return pipe(
    when(isNilOrEmpty, always(jetpack.cwd())),      // default to the current directory
    x => jetpack.read(`${x}/package.json`, 'json'), // read the package.json there
    when(isNilOrEmpty, always({})),                 // default to {}
    dotPath('staplegun.plugins'),                   // grab the plugins
    when(isNilOrEmpty, always({})),                 // default to {}
    keys,                                           // grab the keys
    map(x => `${jetpack.cwd()}/node_modules/${x}`)  // those are our modules
  )(directory)
}

export default getPluginDirectoriesFromPackage
