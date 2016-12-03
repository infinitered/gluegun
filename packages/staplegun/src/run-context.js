// @flow
import autobind from 'autobind-decorator'

@autobind
export default class RunContext {

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
  result: any = null

  /**
   * An error, if any.
   */
  error: any = null

  /**
   * The configuration.  A mashup of defaults + overrides.
   */
  config: {}

  /**
   * A lookup table of known directories.
   *
   * Used by the templating system to place your generated files somewhere.
   */
  directories: {} = {}

}
