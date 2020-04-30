// helpers
import { resolve } from 'path'
import { is } from '../toolbox/utils'

// domains
import { Command, GluegunCommand } from '../domain/command'
import { Extension } from '../domain/extension'
import { Plugin } from '../domain/plugin'
import { GluegunToolbox } from '../domain/toolbox'
import { Options, GluegunLoadOptions, GluegunMultiLoadOptions } from '../domain/options'

// loaders
import { loadCommandFromPreload } from '../loaders/command-loader'
import { loadConfig } from '../loaders/config-loader'
import { loadPluginFromDirectory } from '../loaders/plugin-loader'

// tools
import { filesystem } from '../toolbox/filesystem-tools'
import { strings } from '../toolbox/string-tools'

// the special run function
import { run } from './run'

/**
 * Loads plugins, extensions, and invokes the intended command.
 */
export class Runtime {
  public brand?: string
  public readonly plugins?: Plugin[] = []
  public readonly extensions?: Extension[] = []
  public readonly commands?: Command[] = []
  public defaults: Options = {}
  public defaultPlugin?: Plugin = null
  public defaultCommand?: Command = null
  public config: Options = {}
  public checkUpdate = false
  public run: (rawCommand?: string | Options, extraOptions?: Options) => Promise<GluegunToolbox>

  /**
   * Create and initialize an empty Runtime.
   */
  constructor(brand?: string) {
    this.brand = brand
    this.run = run // awkward because node.js doesn't support async-based class functions yet.
  }

  /**
   * Adds the core extensions.  These provide the basic features
   * available in gluegun, but follow a similar method
   * for extending the core as 3rd party extensions do.
   */
  public addCoreExtensions(exclude: string[] = []): void {
    const coreExtensions = [
      'meta',
      'strings',
      'print',
      'filesystem',
      'semver',
      'system',
      'prompt',
      'http',
      'template',
      'patching',
      'package-manager',
    ]

    coreExtensions.forEach(ex => {
      if (!exclude.includes(ex)) {
        this.addExtension(ex, require(`../core-extensions/${ex}-extension`))
      }
    })
  }

  /**
   * Adds a command to the runtime.
   *
   * @param command A GluegunCommand.
   * @returns This runtime.
   */
  public addCommand(command: GluegunCommand): Runtime {
    if (!command.plugin && !this.defaultPlugin) {
      throw new Error(
        `Can't add command ${command.name} - no default plugin. You may have forgotten a src() on your runtime.`,
      )
    }

    // convert the command to a real Command object (if needed)
    const newCommand: Command = is(Command, command) ? (command as Command) : loadCommandFromPreload(command)

    // set the command's plugin reference to the defaultPlugin
    // if it doesn't already have one
    if (!newCommand.plugin) {
      newCommand.plugin = this.defaultPlugin
      this.defaultPlugin.commands.push(newCommand)
    }

    if (newCommand.name === this.brand) {
      // we want to keep a reference to the default command, so we can find it later
      this.defaultCommand = newCommand
    }

    // add the command to the runtime (if it isn't already there)
    if (!this.commands.find(c => c.commandPath === newCommand.commandPath)) {
      this.commands.push(newCommand)
    }

    // now sort the commands
    this.commands.sort((a, b) => {
      if (a === this.defaultCommand) return -1
      if (b === this.defaultCommand) return 1
      if (a.plugin === this.defaultPlugin) return -1
      if (b.plugin === this.defaultPlugin) return 1
      return 0
    })

    return this
  }

  /**
   * Adds an extension so it is available when commands run. They usually live
   * as the given name on the toolbox object passed to commands, but are able
   * to manipulate the toolbox object however they want. The second
   * parameter is a function that allows the extension to attach itself.
   *
   * @param name The toolbox property name.
   * @param setup The setup function.
   * @returns This runtime.
   */
  public addExtension(name: string, setup: any): Runtime {
    setup = setup.default || setup
    this.extensions.push({ name, setup })
    return this
  }

  /**
   * Loads a plugin from a directory and sets it as the default.
   *
   * @param directory The directory to load from.
   * @param options Additional loading options.
   * @returns This runtime.
   */
  public addDefaultPlugin(directory: string, options: GluegunLoadOptions = {}): Runtime {
    this.defaultPlugin = this.addPlugin(directory, { required: true, name: this.brand, ...options })

    // load config and set defaults
    const loadedConfig = loadConfig(this.brand, directory) || {}
    const { defaults, ...config } = loadedConfig
    this.defaults = defaults
    this.config = config

    return this
  }

  /**
   * Loads a plugin from a directory.
   *
   * @param directory The directory to load from.
   * @param options Additional loading options.
   * @returns The plugin that was created or null.
   */
  public addPlugin(directory: string, options: GluegunLoadOptions = {}): Plugin | null {
    if (!filesystem.isDirectory(directory)) {
      if (options.required) {
        throw new Error(`Error: couldn't load plugin (not a directory): ${directory}`)
      } else {
        return undefined
      }
    }

    const plugin = loadPluginFromDirectory(resolve(directory), {
      brand: this.brand,
      hidden: options.hidden,
      name: options.name,
      commandFilePattern: options.commandFilePattern,
      extensionFilePattern: options.extensionFilePattern,
      preloadedCommands: options.preloadedCommands,
    })

    this.plugins.push(plugin)
    plugin.extensions.forEach(extension => this.addExtension(extension.name, extension.setup))
    plugin.commands.forEach(command => this.addCommand(command))
    return plugin
  }

  /**
   * Loads a bunch of plugins from the immediate sub-directories of a directory.
   *
   * @param directory The directory to grab from.
   * @param options Addition loading options.
   * @return This runtime.
   */
  public addPlugins(directory: string, options: GluegunLoadOptions & GluegunMultiLoadOptions = {}): Plugin[] {
    if (strings.isBlank(directory) || !filesystem.isDirectory(directory)) return []

    // find matching filesystem.subdirectories
    const subdirs = filesystem.subdirectories(directory, false, options.matching)

    // load each one using `this.plugin`
    const { matching, ...otherOptions } = options // remove "matching"
    return subdirs.map(dir => this.addPlugin(dir, otherOptions))
  }
}
