import * as os from 'os'
import * as pathlib from 'path'
import * as jetpack from 'fs-jetpack'
import { chmodSync } from 'fs'

import { GluegunFilesystem } from './filesystem-types'

/**
 * Is this a file?
 *
 * @param path The filename to check.
 * @returns `true` if the file exists and is a file, otherwise `false`.
 */
function isFile(path: string): boolean {
  return jetpack.exists(path) === 'file'
}

/**
 * Is this not a file?
 *
 * @param path The filename to check
 * @return `true` if the file doesn't exist.
 */
const isNotFile = (path: string): boolean => !isFile(path)

/**
 * Is this a directory?
 *
 * @param path The directory to check.
 * @returns True/false -- does the directory exist?
 */
function isDirectory(path: string): boolean {
  return jetpack.exists(path) === 'dir'
}

/**
 * Is this not a directory?
 *
 * @param path The directory to check.
 * @return `true` if the directory does not exist, otherwise false.
 */
const isNotDirectory = (path: string): boolean => !isDirectory(path)

/**
 * Gets the immediate subdirectories.
 *
 * @param path Path to a directory to check.
 * @param isRelative Return back the relative directory?
 * @param matching   A jetpack matching filter
 * @return A list of directories
 */
function subdirectories(
  path: string,
  isRelative: boolean = false,
  matching: string = '*',
  symlinks: boolean = false,
): string[] {
  const { strings } = require('./string-tools')
  if (strings.isBlank(path) || !isDirectory(path)) return []

  const dirs = jetpack.cwd(path).find({
    matching,
    directories: true,
    recursive: false,
    files: false,
  })
  if (isRelative) {
    return dirs
  } else {
    return dirs.map(dir => pathlib.join(path, dir))
  }
}

const filesystem: GluegunFilesystem = {
  chmodSync,
  eol: os.EOL, // end of line marker
  homedir: os.homedir, // get home directory
  separator: pathlib.sep, // path separator
  subdirectories, // retrieve subdirectories
  isFile,
  isNotFile,
  isDirectory,
  isNotDirectory,
  resolve: pathlib.resolve,
  // and everything else in jetpack
  ...jetpack,
}

export { filesystem, GluegunFilesystem }
