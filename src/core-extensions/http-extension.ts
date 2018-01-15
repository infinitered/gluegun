import { create } from 'apisauce'
import { RunContext } from '../domain/run-context'

/**
 * An extension to talk to ye olde internet.
 *
 * @param context The running context.
 */
export default function attach(context: RunContext): void {
  context.http = { create }
}
