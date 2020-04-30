import { GluegunToolbox } from '../domain/toolbox'
import { packageManager } from '../toolbox/package-manager-tools'

/**
 * Extensions to filesystem.  Brought to you by fs-jetpack.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: GluegunToolbox) {
  toolbox.packageManager = packageManager
}
