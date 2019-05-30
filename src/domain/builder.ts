import { Runtime } from '../runtime/runtime'
import coreCommandHelp from '../core-commands/help'
import coreCommandDefault from '../core-commands/default'
import coreCommandVersion from '../core-commands/version'
import { GluegunCommand } from './command'
import { GluegunLoadOptions, GluegunMultiLoadOptions } from './options'

interface BuilderItem {
  value: string
  options: GluegunLoadOptions
}

/**
 * Provides a cleaner way to build a runtime.
 *
 * @class Builder
 */
export class Builder {
  private data: {
    defaultCommand?: GluegunCommand
    brand?: string
    excludes: string[]
    defaultPlugin?: BuilderItem
    commands: GluegunCommand[]
    plugins: BuilderItem[]
    multiPlugins: { value: string; options: GluegunLoadOptions & GluegunMultiLoadOptions }[]
    checkUpdate: boolean
  }

  constructor(brand?: string) {
    this.data = {
      brand: brand,
      excludes: [],
      commands: [],
      plugins: [],
      multiPlugins: [],
      checkUpdate: false,
    }
  }

  /**
   * Ideally named after the command line, the brand will be used
   * when searching for configuration files.
   *
   * @param name The name should be all lowercase and contains only numbers, letters, and dashes.
   */
  public brand(value: string): Builder {
    this.data.brand = value
    return this
  }

  /**
   * Excludes core libraries if they're not needed, for performance reasons.
   */
  public exclude(excludes: string[]) {
    this.data.excludes = excludes
    return this
  }

  /**
   * Specifies where the default commands and extensions live.
   *
   * @param value The path to the source directory.
   * @param options Additional plugin loading options.
   * @return self.
   */
  public src(value: string, options: GluegunLoadOptions = {}): Builder {
    this.data.defaultPlugin = { value, options }
    return this
  }

  /**
   * Add a plugin to the list.
   *
   * @param value   The plugin directory.
   * @param options Additional loading options.
   * @return self.
   */
  public plugin(value: string, options: GluegunLoadOptions = {}): Builder {
    this.data.plugins.push({ value, options })
    return this
  }

  /**
   * Add a plugin group to the list.
   *
   * @param value   The directory with sub-directories.
   * @param options Additional loading options.
   * @return self.
   */
  public plugins(value: string, options: GluegunLoadOptions & GluegunMultiLoadOptions = {}): Builder {
    this.data.multiPlugins.push({ value, options })
    return this
  }

  /**
   * Add a default help handler.
   * @param command An optional command function or object
   * @return self.
   */
  public help(command?: any): Builder {
    command = command || coreCommandHelp
    if (typeof command === 'function') {
      command = { name: 'help', alias: ['h'], dashed: true, run: command }
    }
    return this.command(command)
  }

  /**
   * Add a default version handler.
   * @param command An optional command function or object
   * @return self.
   */
  public version(command?: any): Builder {
    command = command || coreCommandVersion
    if (typeof command === 'function') {
      command = { name: 'version', alias: ['v'], dashed: true, run: command }
    }
    return this.command(command)
  }

  /**
   * Add a default command that runs if none other is found.
   * @param command An optional command function or object
   * @return self.
   */
  public defaultCommand(command?: any): Builder {
    command = command || coreCommandDefault
    if (typeof command === 'function') {
      command = { run: command }
    }
    command.name = this.data.brand
    this.data.defaultCommand = command
    return this
  }

  /**
   * Add a way to add an arbitrary command when building the CLI.
   * @param command command to add
   * @return self.
   */
  public command(command: GluegunCommand): Builder {
    this.data.commands.push(command)
    return this
  }

  /**
   * Check for updates randomly.
   *
   * @param frequency % frequency of checking
   * @return self.
   */
  public checkForUpdates(frequency: number): Builder {
    this.data.checkUpdate = Math.floor(Math.random() * 100) + 1 < frequency
    return this
  }

  /**
   * Hand over the runtime.
   */
  public create(): Runtime {
    // create a runtime
    const runtime = new Runtime()

    // extract the data the builder has collected
    const { brand, excludes, defaultCommand, defaultPlugin, plugins, multiPlugins, commands } = this.data

    // set the brand
    runtime.brand = brand

    // load the core extensions, minus excludes
    runtime.addCoreExtensions(excludes)

    // add a default plugin
    if (defaultPlugin) runtime.addDefaultPlugin(defaultPlugin.value, defaultPlugin.options)

    // add other plugins, both singular and multiple
    plugins.forEach(p => runtime.addPlugin(p.value, p.options))
    multiPlugins.forEach(mp => runtime.addPlugins(mp.value, mp.options))

    // add a default command first
    if (defaultCommand) runtime.addCommand(defaultCommand)

    // add other commands
    commands.forEach(c => runtime.addCommand(c))

    // check for updates
    runtime.checkUpdate = this.data.checkUpdate

    return runtime
  }
}

/**
 * Export it as a factory function.
 */
export function build(brand?: string): Builder {
  return new Builder(brand)
}
