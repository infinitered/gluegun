import * as jetpack from 'fs-jetpack'
import { complement, concat, map } from 'ramda'
import { isBlank } from './string-tools'

/**
 * Is this a file?
 *
 * @param path The filename to check.
 * @returns `true` if the file exists and is a file, otherwise `false`.
 */
export function isFile(path: string): boolean {
  return jetpack.exists(path) === 'file'
}

/**
 * Is this not a file?
 *
 * @param path The filename to check
 * @return `true` if the file doesn't exist.
 */
export const isNotFile = complement(isFile)

/**
 * Is this a directory?
 *
 * @param path The directory to check.
 * @returns True/false -- does the directory exist?
 */
export function isDirectory(path: string): boolean {
  return jetpack.exists(path) === 'dir'
}

/**
 * Is this not a directory?
 *
 * @param path The directory to check.
 * @return `true` if the directory does not exist, otherwise false.
 */
export const isNotDirectory = complement(isDirectory)

/**
 * Gets the immediate subdirectories.
 *
 * @param path Path to a directory to check.
 * @param isRelative Return back the relative directory?
 * @param matching   A jetpack matching filter
 * @param symlinks  If true, will include any symlinks along the way.
 * @return A list of directories
 */
export function subdirectories(
  path: string,
  isRelative: boolean = false,
  matching: string = '*',
  symlinks: boolean = false,
): string[] {
  if (isBlank(path) || !isDirectory(path)) {
    return []
  }
  const dirs = jetpack.cwd(path).find({
    matching,
    directories: true,
    recursive: false,
    files: false,
    symlinks,
  })
  if (isRelative) {
    return dirs
  } else {
    return map(concat(`${path}/`), dirs)
  }
}
