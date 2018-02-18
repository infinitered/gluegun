import * as semver from 'semver'
import { GluegunToolbox } from '../domain/toolbox'

/**
 * Extensions to access semver and helpers
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: GluegunToolbox): void {
  toolbox.semver = semver
}
