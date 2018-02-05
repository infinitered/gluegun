import { GluegunRunContext } from '../domain/run-context'
import { update, append, prepend, replace, patch, exists } from '../toolbox/patching-tools'

/**
 * Builds the patching feature.
 *
 * @param context The running context.
 */
export default function attach(context: GluegunRunContext): void {
  context.patching = { update, append, prepend, replace, patch, exists }
}
