// helpers
import { resolve } from 'path'
import { dissoc } from 'ramda'

// domains
import { Command } from '../domain/command'
import { Extension } from '../domain/extension'
import { Plugin } from '../domain/plugin'
import { RunContext } from '../domain/run-context'
import { Options } from '../domain/options'

// loaders
import { loadCommandFromPreload } from '../loaders/command-loader'
import { loadConfig } from '../loaders/config-loader'
import { loadPluginFromDirectory } from '../loaders/plugin-loader'

// tools
import { isDirectory, subdirectories } from '../toolbox/filesystem-tools'
import { isBlank } from '../toolbox/string-tools'

// the special run function
import { run } from './run'

// core extensions
import metaExtensionAttach from '../core-extensions/meta-extension'
import templateExtensionAttach from '../core-extensions/template-extension'
import printExtensionAttach from '../core-extensions/print-extension'
import filesystemExtensionAttach from '../core-extensions/filesystem-extension'
import semverExtensionAttach from '../core-extensions/semver-extension'
import systemExtensionAttach from '../core-extensions/system-extension'
import promptExtensionAttach from '../core-extensions/prompt-extension'
import httpExtensionAttach from '../core-extensions/http-extension'
import stringsExtensionAttach from '../core-extensions/strings-extension'
import patchingExtensionAttach from '../core-extensions/patching-extension'

/**
 * Loads plugins, extensions, and invokes the intended command.
 */
export class Runtime {
  public brand?: string
  public plugins?: Plugin[]
  public extensions?: Extension[]
  public defaults?: object
  public defaultPlugin?: Plugin
  public config?: object
  public run?: (rawCommand: string | object, extraOptions?: object) => any

  /**
   * Create and initialize an empty Runtime.
   */
  constructor(brand?: string) {
    this.brand = brand
    this.run = run // awkward because node.js doesn't support async-based class functions yet.
    this.plugins = []
    this.extensions = []
    this.defaults = {}
    this.defaultPlugin = null
    this.config = {}

    this.addCoreExtensions()
  }

  /**
   * For backwards compatability. No-op.
   * @returns {Runtime} This runtime.
   */
  public create(): Runtime {
    return this
  }

  /**
   * Adds the core extensions.  These provide the basic features
   * available in gluegun, but follow the exact same method
   * for extending the core as 3rd party extensions do.
   */
  public addCoreExtensions(): void {
    this.addExtension('meta', metaExtensionAttach)
    this.addExtension('strings', templateExtensionAttach)
    this.addExtension('print', printExtensionAttach)
    this.addExtension('template', filesystemExtensionAttach)
    this.addExtension('filesystem', semverExtensionAttach)
    this.addExtension('semver', systemExtensionAttach)
    this.addExtension('system', promptExtensionAttach)
    this.addExtension('http', httpExtensionAttach)
    this.addExtension('prompt', stringsExtensionAttach)
    this.addExtension('patching', patchingExtensionAttach)
  }

  /**
   * Adds a command to the runtime.
   *
   * @param {Object} command
   */
  public addCommand(command: any): Runtime {
    if (!this.defaultPlugin) {
      throw new Error(
        `Can't add command ${command.name} - no default plugin. You may have forgotten a src() on your runtime.`,
      )
    }
    const newCommand: Command = loadCommandFromPreload(command)

    if (newCommand.name === this.brand) {
      // default command is always the last command in the stack
      this.defaultPlugin.commands.push(newCommand)
    } else {
      // other commands go first
      this.defaultPlugin.commands.unshift(newCommand)
    }
    return this
  }

  /**
   * Adds an extension so it is available when commands run. They usually live
   * as the given name on the context object passed to commands, but are able
   * to manipulate the context object however they want. The second
   * parameter is a function that allows the extension to attach itself.
   *
   * @param {string} name   The context property name.
   * @param {object} setup  The setup function.
   */
  public addExtension(name: string, setup: (context: RunContext) => any): Runtime {
    this.extensions.push({ name, setup })
    return this
  }

  /**
   * Loads a plugin from a directory and sets it as the default.
   *
   * @param  {string} directory The directory to load from.
   * @param  {Object} options   Additional loading options.
   * @return {Runtime}          This runtime.
   */
  public addDefaultPlugin(directory: string, options: object = {}): Runtime {
    this.defaultPlugin = this.addPlugin(directory, { required: true, name: this.brand, ...options })

    // load config and set defaults
    const config = loadConfig(this.brand, directory) || {}
    this.defaults = config.defaults
    this.config = dissoc('defaults', config)

    return this
  }

  /**
   * Loads a plugin from a directory.
   *
   * @param  {string} directory The directory to load from.
   * @param  {Object} options   Additional loading options.
   * @return {Plugin | null}           The plugin that was created.
   */
  public addPlugin(directory: string, options: Options = {}): Plugin | null {
    if (!isDirectory(directory)) {
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
    return plugin
  }

  /**
   * Loads a bunch of plugins from the immediate sub-directories of a directory.
   *
   * @param {string} directory The directory to grab from.
   * @param {Object} options   Addition loading options.
   * @return {Runtime}         This runtime
   */
  public addPlugins(directory: string, options: Options = {}): Plugin[] {
    if (isBlank(directory) || !isDirectory(directory)) {
      return []
    }

    // find matching subdirectories
    const subdirs = subdirectories(directory, false, options.matching, true)

    // load each one using `this.plugin`
    return subdirs.map(dir => this.addPlugin(dir, dissoc('matching', options)))
  }
}
