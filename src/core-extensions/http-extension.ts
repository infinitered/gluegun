import { create } from 'apisauce'
import { GluegunRunContext } from '../domain/run-context'

/**
 * An extension to talk to ye olde internet.
 *
 * @param context The running context.
 */
export default function attach(context: GluegunRunContext): void {
  context.http = { create }
}
