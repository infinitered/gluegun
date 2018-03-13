import { GluegunToolbox } from '../domain/toolbox'
import { http } from '../toolbox/http-tools'

/**
 * An extension to talk to ye olde internet.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: GluegunToolbox): void {
  toolbox.http = http
}
