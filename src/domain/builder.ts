import Runtime from '../runtime/runtime'

/**
 * Provides a cleaner way to build a runtime.
 *
 * @class Builder
 */
export class Builder {
  public runtime: Runtime

  constructor () {
    this.runtime = new Runtime()
  }

  /**
   * Ideally named after the command line, the brand will be used
   * when searching for configuration files.
   *
   * @param name The name should be all lowercase and contains only numbers, letters, and dashes.
   */
  public brand (value: string): Builder {
    this.runtime.brand = value
    return this
  }

  /**
   * Specifies where the default commands and extensions live.
   *
   * @param value The path to the source directory.
   * @param options Additional plugin loading options.
   * @return {Builder} self.
   */
  public src (value: string, options: object = {}): Builder {
    this.runtime.addDefaultPlugin(value, options)
    return this
  }

  /**
   * Add a plugin to the list.
   *
   * @param  {string}  value   The plugin directory.
   * @param  {Object}  options Additional loading options.
   * @return {Builder}         self.
   */
  public plugin (value: string, options: object = {}) {
    this.runtime.addPlugin(value, options)
    return this
  }

  /**
   * Add a plugin group to the list.
   *
   * @param  {string}  value   The directory with sub-directories.
   * @param  {Object}  options Additional loading options.
   * @return {Builder}         self.
   */
  public plugins (value: string, options: object = {}) {
    this.runtime.addPlugin(value, options)
    return this
  }

  /**
   * Add a default help handler.
   * @param  {any} command An optional command function or object
   * @return {Builder}         self.
   */
  public help (command?: any) {
    command = command || require(`../core-commands/help`)
    if (typeof command === 'function') {
      command = { name: 'help', alias: ['h'], dashed: true, run: command }
    }
    return this.command(command)
  }

  /**
   * Add a default version handler.
   * @param  {any} command An optional command function or object
   * @return {Builder}         self.
   */
  public version (command?: any) {
    command = command || require(`../core-commands/version`)
    if (typeof command === 'function') {
      command = { name: 'version', alias: ['v'], dashed: true, run: command }
    }
    return this.command(command)
  }

  /**
   * Add a default command that runs if none other is found.
   * @param  {any} command An optional command function or object
   * @return {Builder}         self.
   */
  public defaultCommand (command?: any) {
    command = command || require(`../core-commands/default`)
    if (typeof command === 'function') {
      command = { run: command }
    }
    command.name = this.runtime.brand
    return this.command(command)
  }

  /**
   * Add a way to add an arbitrary command when building the CLI.
   * @param {Object}
   * @return {Builder}
   */
  public command (command: object) {
    this.runtime.addCommand(command)
    return this
  }

  /**
   * Hand over the runtime.
   */
  public create (): Runtime {
    return this.runtime
  }
}

/**
 * Export it as a factory function.
 */
export function build (): Builder {
  return new Builder()
}
