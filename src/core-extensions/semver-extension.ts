import * as semver from 'semver'
import { RunContext } from '../domain/run-context'

/**
 * Extensions to access semver and helpers
 *
 * @param  {RunContext} context The running context.
 */
export default function attach(context: RunContext) {
  context.semver = semver
}
