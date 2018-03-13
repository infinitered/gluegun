import { GluegunToolbox } from '../domain/toolbox'
import { filesystem } from '../toolbox/filesystem-tools'

/**
 * Extensions to filesystem.  Brought to you by fs-jetpack.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: GluegunToolbox) {
  toolbox.filesystem = filesystem
}
