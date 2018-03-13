import { GluegunToolbox } from '../domain/toolbox'
import { patching } from '../toolbox/patching-tools'

/**
 * Builds the patching feature.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: GluegunToolbox): void {
  toolbox.patching = patching
}
