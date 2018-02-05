import * as semver from 'semver'
import { GluegunRunContext } from '../domain/run-context'

/**
 * Extensions to access semver and helpers
 *
 * @param context The running context.
 */
export default function attach(context: GluegunRunContext): void {
  context.semver = semver
}
