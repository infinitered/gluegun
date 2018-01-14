import * as stringTools from '../toolbox/string-tools'
import { RunContext } from '../domain/run-context'

/**
 * Attaches some string helpers for convenience.
 *
 * @param context The running context.
 */
export default function attach(context: RunContext): void {
  context.strings = stringTools
}
