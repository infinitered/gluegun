import { GluegunToolbox } from '../domain/toolbox'
import { update, append, prepend, replace, patch, exists } from '../toolbox/patching-tools'

/**
 * Builds the patching feature.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: GluegunToolbox): void {
  toolbox.patching = { update, append, prepend, replace, patch, exists }
}
