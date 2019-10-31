import * as path from 'path'
import * as jetpack from 'fs-jetpack'
import { Plugin } from '../domain/plugin'
import { Options } from '../domain/options'
import { filesystem } from '../toolbox/filesystem-tools'
import { strings } from '../toolbox/string-tools'
import { loadCommandFromFile, loadCommandFromPreload } from './command-loader'
import { loadConfig } from './config-loader'
import { loadExtensionFromFile } from './extension-loader'

/**
 * Loads a plugin from a directory.
 *
 * @param directory The full path to the directory to load.
 * @param options Additional options to customize the loading process.
 */
export function loadPluginFromDirectory(directory: string, options: Options = {}): Plugin {
  const plugin = new Plugin()

  const {
    brand = 'gluegun',
    commandFilePattern = [`*.{js,ts}`, `!*.test.{js,ts}`],
    extensionFilePattern = [`*.{js,ts}`, `!*.test.{js,ts}`],
    hidden = false,
    name,
  } = options

  plugin.hidden = Boolean(options.hidden)

  if (!strings.isBlank(name)) {
    plugin.name = name
  }

  // directory check
  if (filesystem.isNotDirectory(directory)) {
    throw new Error(`Error: couldn't load plugin (not a directory): ${directory}`)
  }

  plugin.directory = directory

  // the directory is the default name (unless we were told what it was)
  if (strings.isBlank(name)) {
    plugin.name = jetpack.inspect(directory).name
  }

  const jetpackPlugin = jetpack.cwd(plugin.directory)

  // load any default commands passed in
  plugin.commands = (options.preloadedCommands || []).map(loadCommandFromPreload)

  // load the commands found in the commands sub-directory
  const commandSearchDirectories = ['commands', 'build/commands']
  commandSearchDirectories.map(dir => {
    if (jetpackPlugin.exists(dir) === 'dir') {
      const commands = jetpackPlugin.cwd(dir).find({ matching: commandFilePattern, recursive: true })

      plugin.commands = plugin.commands.concat(
        commands.map(file => loadCommandFromFile(path.join(directory, dir, file))),
      )
    }
  })

  // load the extensions found in the extensions sub-directory
  const extensionSearchDirectories = ['extensions', 'build/extensions']
  extensionSearchDirectories.map(dir => {
    if (jetpackPlugin.exists(dir) === 'dir') {
      const extensions = jetpackPlugin.cwd(dir).find({ matching: extensionFilePattern, recursive: false })

      plugin.extensions = plugin.extensions.concat(
        extensions.map(file => loadExtensionFromFile(`${directory}/${dir}/${file}`)),
      )
    }
  })

  // load config using cosmiconfig
  const config = loadConfig(plugin.name, directory)

  // set the name if we have one (unless we were told what it was)
  plugin.name = config.name || plugin.name
  plugin[brand] = config[brand]
  plugin.defaults = config.defaults || {}
  plugin.description = config.description

  // set the hidden bit
  if (hidden) {
    plugin.commands.forEach(command => (command.hidden = true))
  }

  // set all commands to reference their parent plugin
  plugin.commands.forEach(c => (c.plugin = plugin))

  // sort plugin commands alphabetically
  plugin.commands = plugin.commands.sort((a, b) => (a.commandPath.join(' ') < b.commandPath.join(' ') ? -1 : 1))

  return plugin
}
