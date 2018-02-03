import * as jetpack from 'fs-jetpack'
import { equals, map, pipe, prop, propEq, reject, replace, sortBy, unnest } from 'ramda'
import { Plugin } from '../domain/plugin'
import { GluegunRunContext } from '../domain/run-context'
/**
 * Finds the version for the currently running CLI.
 *
 * @param context Currently running context.
 * @returns Version as a string.
 */
export function getVersion(context: GluegunRunContext): string {
  let directory = context.runtime.defaultPlugin && context.runtime.defaultPlugin.directory
  if (!directory) {
    throw new Error('context.version: Unknown CLI version (no src folder found)')
  }

  // go at most 5 directories up to find the package.json
  for (let i = 0; i < 5; i += 1) {
    const pkg = jetpack.path(directory, 'package.json')

    // if we find a package.json, we're done -- read the version and return it
    if (jetpack.exists(pkg) === 'file') {
      return jetpack.read(pkg, 'json').version
    }

    // if we reach the git repo or root, we can't determine the version -- this is where we bail
    const git = jetpack.path(directory, '.git')
    const root = jetpack.path('/')
    if (directory === root || jetpack.exists(git) === 'dir') {
      break
    }

    // go up another directory
    directory = jetpack.path(directory, '..')
  }
  throw new Error(`context.version: Unknown CLI version (no package.json found in ${directory}`)
}

/**
 * Is this a hidden command?
 */
const isHidden = propEq('hidden', true)

/**
 * Gets the list of plugins.
 *
 * @param context The context
 * @param plugins The plugins holding the commands
 * @param commandRoot Optional, only show commands with this root
 * @return List of plugins.
 */
export function commandInfo(context: GluegunRunContext, plugins?: Plugin[], commandRoot?: string[]): string[][] {
  return pipe(reject(isHidden), sortBy(prop('name')), map(p => getListOfCommands(context, p, commandRoot)), unnest)(
    plugins || context.runtime.plugins,
  ) as string[][]
}

/**
 * Gets the list of commands for the given plugin.
 *
 * @param context The context
 * @param plugin The plugins holding the commands
 * @param commandRoot   Optional, only show commands with this root
 * @return List of commands.
 */
export function getListOfCommands(context: GluegunRunContext, plugin?: Plugin, commandRoot?: string[]): string[][] {
  return pipe(
    reject(isHidden),
    reject(command => {
      if (!commandRoot) {
        return false
      }
      return !equals(command.commandPath.slice(0, commandRoot.length), commandRoot)
    }),
    map(command => {
      const alias = command.hasAlias() ? `(${command.aliases.join(', ')})` : ''
      return [
        `${command.commandPath.join(' ')} ${alias}`,
        replace('$BRAND', context.runtime.brand, command.description || '-'),
      ]
    }),
  )(plugin.commands)
}
