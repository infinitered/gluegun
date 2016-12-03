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

}
