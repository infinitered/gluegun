import * as jetpack from 'fs-jetpack'
import * as os from 'os'
import * as path from 'path'
import { subdirectories } from '../toolbox/filesystem-tools'
import { RunContext } from '../domain/run-context'

/**
 * Extensions to filesystem.  Brought to you by fs-jetpack.
 *
 * @param context The running context.
 */
export default function attach(context: RunContext) {
  const extension = jetpack // jetpack
  extension.eol = os.EOL // end of line marker
  extension.separator = path.sep // path separator
  extension.subdirectories = subdirectories

  context.filesystem = extension
}
