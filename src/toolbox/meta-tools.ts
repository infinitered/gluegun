import * as jetpack from 'fs-jetpack'
import { equals, replace } from './utils'
import { GluegunToolbox } from '../domain/toolbox'
/**
 * Finds the version for the currently running CLI.
 *
 * @param toolbox Currently running toolbox.
 * @returns Version as a string.
 */
export function getVersion(toolbox: GluegunToolbox): string {
  let directory = toolbox.runtime.defaultPlugin && toolbox.runtime.defaultPlugin.directory
  if (!directory) throw new Error('getVersion: Unknown CLI version (no src folder found)')

  // go at most 5 directories up to find the package.json
  for (let i = 0; i < 5; i += 1) {
    const pkg = jetpack.path(directory, 'package.json')

    // if we find a package.json, we're done -- read the version and return it
    if (jetpack.exists(pkg) === 'file') return jetpack.read(pkg, 'json').version

    // if we reach the git repo or root, we can't determine the version -- this is where we bail
    const git = jetpack.path(directory, '.git')
    const root = jetpack.path('/')
    if (directory === root || jetpack.exists(git) === 'dir') break

    // go up another directory
    directory = jetpack.path(directory, '..')
  }
  throw new Error(`getVersion: Unknown CLI version (no package.json found in ${directory}`)
}

/**
 * Gets the list of plugins.
 *
 * @param toolbox The toolbox
 * @param plugins The plugins holding the commands
 * @param commandRoot Optional, only show commands with this root
 * @return List of plugins.
 */
export function commandInfo(toolbox: GluegunToolbox, commandRoot?: string[]): string[][] {
  return toolbox.runtime.commands
    .filter(c => !c.hidden)
    .filter(c => !commandRoot || equals(c.commandPath.slice(0, commandRoot.length), commandRoot))
    .map(command => {
      const alias = command.hasAlias() ? `(${command.aliases.join(', ')})` : ''
      const commandPath = command.name ? command.commandPath.slice(0, -1).concat(command.name) : command.commandPath

      return [`${commandPath.join(' ')} ${alias}`, replace('$BRAND', toolbox.runtime.brand, command.description || '-')]
    })
}
