import * as semver from 'semver'
import { RunContext } from '../domain/run-context'

/**
 * Extensions to access semver and helpers
 *
 * @param context The running context.
 */
export default function attach(context: RunContext): void {
  context.semver = semver
}
