import * as print from '../toolbox/print-tools'
import { GluegunToolbox } from '../domain/toolbox'
import { GluegunPrint } from '../core-extensions/print-types'

/**
 * Extensions to print to the console.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: GluegunToolbox): void {
  // attach the feature set
  toolbox.print = print as GluegunPrint
}
