import { create } from 'apisauce'
import { RunContext } from '../domain/run-context'

/**
 * An extension to talk to ye olde internet.
 *
 * @param  {RunContext} context The running context.
 */
export default function attach(context: RunContext) {
  context.http = { create }
}
