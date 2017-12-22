import * as jetpack from 'fs-jetpack'
import * as os from 'os'
import * as path from 'path'
import { subdirectories } from '../toolbox/filesystem-tools'

/**
 * Extensions to filesystem.  Brought to you by fs-jetpack.
 *
 * @param  {RunContext} context The running context.
 */
function attach (context) {
  const extension = jetpack // jetpack
  extension.eol = os.EOL // end of line marker
  extension.separator = path.sep // path separator
  extension.subdirectories = subdirectories

  context.filesystem = extension
}

module.exports = attach
