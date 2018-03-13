import { GluegunToolbox } from '../domain/toolbox'
import { semver } from '../toolbox/semver-tools'

/**
 * Extensions to access semver and helpers
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: GluegunToolbox): void {
  toolbox.semver = semver
}
