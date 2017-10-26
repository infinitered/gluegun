const jetpack = require('fs-jetpack')
const { map, concat, complement } = require('ramda')
const { isBlank } = require('./string-utils')

/**
 * Is this a file?
 *
 * @param  {string} path The filename to check.
 * @return {bool}        `true` if the file exists and is a file, otherwise `false`.
 */
const isFile = path => jetpack.exists(path) === 'file'

/**
 * Is this not a file?
 *
 * @param  {string} path The filename to check
 * @return {bool}        `true` if the file doesn't exist.
 */
const isNotFile = complement(isFile)

/**
 * Is this a directory?
 *
 * @param {string} path The directory to check.
 * @return {bool}       `true` if the directory exists, otherwise false.
 */
const isDirectory = path => jetpack.exists(path) === 'dir'

/**
 * Is this not a directory?
 *
 * @param {string} path The directory to check.
 * @return {bool}       `true` if the directory does not exist, otherwise false.
 */
const isNotDirectory = complement(isDirectory)

/**
 * Gets the immediate subdirectories.
 *
 * @param  {string} path       Path to a directory to check.
 * @param  {bool}   isRelative Return back the relative directory?
 * @param  {string} matching   A jetpack matching filter
 * @param  {boolean} symlinks  If true, will include any symlinks along the way.
 * @return {string[]}          A list of directories
 */
const subdirectories = (base, isRelative, matching = '*', symlinks = false) => {
  if (isBlank(base) || !isDirectory(base)) return []
  const dirs = jetpack.cwd(base).find({
    matching,
    directories: true,
    recursive: false,
    files: false,
    symlinks
  })
  if (isRelative) {
    return dirs
  } else {
    return map(concat(`${base}/`), dirs)
  }
}

module.exports = {
  isFile,
  isNotFile,
  isDirectory,
  isNotDirectory,
  subdirectories
}
