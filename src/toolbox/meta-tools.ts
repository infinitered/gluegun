import { equals, replace } from './utils'
import { GluegunToolbox } from '../domain/toolbox'
import { PackageJSON } from './meta-types'

/**
 * Finds the currently running CLI package.json
 *
 * @param toolbox
 * @returns Package.json contents as an object.
 */
export function getPackageJSON(toolbox: GluegunToolbox): PackageJSON {
  let directory = toolbox.meta.src
  const { filesystem } = toolbox
  if (!directory) throw new Error('getVersion: Unknown CLI version (no src folder found)')

  // go at most 5 directories up to find the package.json
  for (let i = 0; i < 5; i += 1) {
    const pkg = filesystem.path(directory, 'package.json')

    // if we find a package.json, we're done -- read the version and return it
    if (filesystem.exists(pkg) === 'file') return filesystem.read(pkg, 'json') as PackageJSON

    // if we reach the git repo or root, we can't determine the version -- this is where we bail
    const git = filesystem.path(directory, '.git')
    const root = filesystem.path('/')
    if (directory === root || filesystem.exists(git) === 'dir') break

    // go up another directory
    directory = filesystem.path(directory, '..')
  }

  throw new Error(`getPackageJSON: No package.json found in ${directory}`)
}

/**
 * Finds the version for the currently running CLI.
 *
 * @param toolbox Currently running toolbox.
 * @returns Version as a string.
 */
export function getVersion(toolbox: GluegunToolbox): string {
  return getPackageJSON(toolbox).version
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
  return toolbox.runtime.commands.reduce((commands, command) => {
    if (!command.hidden && (!commandRoot || equals(command.commandPath.slice(0, commandRoot.length), commandRoot))) {
      const alias = command.hasAlias() ? `(${command.aliases.join(', ')})` : ''
      const commandPath = command.name ? command.commandPath.slice(0, -1).concat(command.name) : command.commandPath
      commands.push([
        `${commandPath.join(' ')} ${alias}`,
        replace('$BRAND', toolbox.runtime.brand, command.description || '-'),
      ])
    }

    return commands
  }, [])
}

export async function checkForUpdate(toolbox: GluegunToolbox): Promise<false | string> {
  const { system, semver } = toolbox
  const packageJSON = getPackageJSON(toolbox)
  const myVersion = packageJSON.version
  const packageName = packageJSON.name
  const latestVersion = await system.run(`npm info ${packageName} dist-tags.latest`)
  if (semver.gt(latestVersion, myVersion)) return latestVersion
  return false
}
