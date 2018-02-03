import * as stringTools from '../toolbox/string-tools'
import { GluegunRunContext } from '../domain/run-context'

/**
 * Attaches some string helpers for convenience.
 *
 * @param context The running context.
 */
export default function attach(context: GluegunRunContext): void {
  context.strings = stringTools
}
