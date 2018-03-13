import { strings } from '../toolbox/string-tools'
import { GluegunToolbox } from '../domain/toolbox'

/**
 * Attaches some string helpers for convenience.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: GluegunToolbox): void {
  toolbox.strings = strings
}
