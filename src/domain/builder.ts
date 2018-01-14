import { Runtime } from '../runtime/runtime'
import coreCommandHelp from '../core-commands/help'
import coreCommandDefault from '../core-commands/default'
import coreCommandVersion from '../core-commands/version'
import { Options } from './options'
import { GluegunCommand } from './command'

/**
 * Provides a cleaner way to build a runtime.
 *
 * @class Builder
 */
export class Builder {
  public runtime: Runtime

  constructor() {
    this.runtime = new Runtime()
  }

  /**
   * Ideally named after the command line, the brand will be used
   * when searching for configuration files.
   *
   * @param name The name should be all lowercase and contains only numbers, letters, and dashes.
   */
  public brand(value: string): Builder {
    this.runtime.brand = value
    return this
  }

  /**
   * Specifies where the default commands and extensions live.
   *
   * @param value The path to the source directory.
   * @param options Additional plugin loading options.
   * @return self.
   */
  public src(value: string, options: Options = {}): Builder {
    this.runtime.addDefaultPlugin(value, options)
    return this
  }

  /**
   * Add a plugin to the list.
   *
   * @param value   The plugin directory.
   * @param options Additional loading options.
   * @return self.
   */
  public plugin(value: string, options: Options = {}): Builder {
    this.runtime.addPlugin(value, options)
    return this
  }

  /**
   * Add a plugin group to the list.
   *
   * @param value   The directory with sub-directories.
   * @param options Additional loading options.
   * @return self.
   */
  public plugins(value: string, options: Options = {}): Builder {
    this.runtime.addPlugin(value, options)
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
    command.name = this.runtime.brand
    return this.command(command)
  }

  /**
   * Add a way to add an arbitrary command when building the CLI.
   * @param command command to add
   * @return self.
   */
  public command(command: GluegunCommand): Builder {
    this.runtime.addCommand(command)
    return this
  }

  /**
   * Hand over the runtime.
   */
  public create(): Runtime {
    return this.runtime
  }
}

/**
 * Export it as a factory function.
 */
export function build(): Builder {
  return new Builder()
}
