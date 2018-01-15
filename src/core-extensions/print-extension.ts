import * as print from '../toolbox/print-tools'
import { RunContext } from '../domain/run-context'

/**
 * Extensions to print to the console.
 *
 * @param context The running context.
 */
export default function attach(context: RunContext): void {
  // attach the feature set
  context.print = print
}
