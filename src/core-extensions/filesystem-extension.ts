import * as jetpack from 'fs-jetpack'
import * as os from 'os'
import * as path from 'path'
import { subdirectories } from '../toolbox/filesystem-tools'
import { GluegunToolbox } from '../domain/toolbox'
import { GluegunFilesystem } from './filesystem-types'

/**
 * Extensions to filesystem.  Brought to you by fs-jetpack.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: GluegunToolbox) {
  const extension: GluegunFilesystem = Object.assign(
    {
      eol: os.EOL, // end of line marker
      separator: path.sep, // path separator
      subdirectories: subdirectories, // retrieve subdirectories
    },
    jetpack, // jetpack utilities
  )

  toolbox.filesystem = extension
}
