import * as jetpack from 'fs-jetpack'
import * as os from 'os'
import * as path from 'path'
import { subdirectories } from '../toolbox/filesystem-tools'
import { RunContext } from '../domain/run-context'
import { GluegunFilesystem } from './filesystem-types'

/**
 * Extensions to filesystem.  Brought to you by fs-jetpack.
 *
 * @param context The running context.
 */
export default function attach(context: RunContext) {
  const extension: GluegunFilesystem = Object.assign(
    {
      eol: os.EOL, // end of line marker
      separator: path.sep, // path separator
      subdirectories: subdirectories, // retrieve subdirectories
    },
    jetpack, // jetpack utilities
  )

  context.filesystem = extension
}
