import * as print from '../toolbox/print-tools'
import { GluegunRunContext } from '../domain/run-context'

/**
 * Extensions to print to the console.
 *
 * @param context The running context.
 */
export default function attach(context: GluegunRunContext): void {
  // attach the feature set
  context.print = print
}
