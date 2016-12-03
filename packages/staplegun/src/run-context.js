// @flow
import autobind from 'autobind-decorator'
import Plugin from './plugin'
import Command from './command'

@autobind
export default class RunContext {

  /**
   * The Plugin to run
   */
  plugin: Plugin

  /**
   * The Command to run
   */
  command: Command

  /**
   * The full arguments (including command name)
   */
  fullArguments: string

  /**
   * The parsed arguments to pass to the command
   */
  arguments: string[]

  /**
   * The string version of the arguments for convenience.
   */
  stringArguments: string

  /**
   * Any additional options
   */
  options: any

  /**
   * The result of the run command.
   */
  result: any

  /**
   * Runs the command.
   */
  async run () {
    // run the command
    if (this.command.run) {
      // split the arguments apart and sub args get passed along
      this.result = await this.command.run(this)
    } else {
      this.result = null
    }
    return this
  }

}
