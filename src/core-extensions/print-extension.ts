import * as print from '../toolbox/print-tools'
import { GluegunToolbox } from '../domain/toolbox'

/**
 * Extensions to print to the console.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: GluegunToolbox): void {
  // attach the feature set
  toolbox.print = print
}
