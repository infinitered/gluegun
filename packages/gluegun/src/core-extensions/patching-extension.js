const jetpack = require('fs-jetpack')
const { isFile } = require('../utils/filesystem-utils')

/**
 * Builds the patching feature.
 *
 * @return {Function} A function to attach to the context.
 */
function attach (plugin, command, context) {
  /**
   * Updates a text file or json config file. Async.
   *
   * @param  {string} filename File to be modified.
   * @param  {Function} callback Callback function for modifying the contents of the file.
   * @return {bool}  Whether the operation was successful
   */
  async function update (filename, callback) {
    // bomb if the file doesn't exist
    if (!isFile(filename)) {
      throw new Error(`file not found ${filename}`)
    }

    // check type of file (JSON or not)
    const fileType = filename.endsWith('.json') ? 'json' : 'utf8'

    // read the file
    const contents = await jetpack.readAsync(filename, fileType)

    // let the caller mutate the contents in memory
    const mutatedContents = callback(contents)

    // only write if they actually sent back something non-falsy
    if (mutatedContents) {
      await jetpack.writeAsync(filename, mutatedContents, { atomic: true })
    }

    // send back the rendered string
    return mutatedContents
  }

  /**
   * Convenience function for prepending a string to a given file. Async.
   *
   * @param {string} filename       File to be prepended to
   * @param {string} prependedData  String to prepend
   */
  async function prepend (filename, prependedData) {
    return update(filename, data => prependedData + data)
  }

  /**
   * Convenience function for appending a string to a given file. Async.
   *
   * @param {string} filename       File to be appended to
   * @param {string} appendedData  String to append
   */
  async function append (filename, appendedData) {
    return update(filename, data => data + appendedData)
  }

  /**
   * Convenience function for replacing a string in a given file. Async.
   *
   * @param {string} filename       File to be prepended to
   * @param {string} replace        String to replace
   * @param {string} newContent     String to write
   */
  async function replace (filename, replace, newContent) {
    return update(filename, data => data.replace(replace, newContent))
  }

  /**
   * Conditionally places a string into a file before or after another string,
   * or replacing another string, or deletes a string. Async.
   *
   * @param {string}   filename        File to be patched
   * @param {Object}   opts            Options
   * @param {string}   opts.insert     String to be inserted
   * @param {string}   opts.before     Insert before this string
   * @param {string}   opts.after      Insert after this string
   * @param {string}   opts.replace    Replace this string
   * @param {string}   opts.delete     Delete this string
   * @param {boolean}  opts.force      Write even if it already exists
   *
   * @example
   *   await context.patching.patch('thing.js', { before: 'bar', insert: 'foo' })
   *
   */
  async function patch (filename, opts = {}) {
    return update(filename, data => patchString(data, opts))
  }

  function patchString (data, opts) {
    // Already includes string, and not forcing it
    if (data.includes(opts.insert) && !opts.force) return false

    // delete <string> is the same as replace <string> + insert ''
    const replaceString = opts.delete || opts.replace

    if (replaceString) {
      if (!data.includes(replaceString)) {
        return false
      }
      // Replace matching string with new string or nothing if nothing provided
      return data.replace(replaceString, `${opts.insert || ''}`)
    } else {
      return insertNextToString(data, opts)
    }
  }

  function insertNextToString (data, opts) {
    // Insert before/after a particular string
    const findString = opts.before || opts.after
    if (!data.includes(findString)) {
      return false
    }

    const newContents = opts.after
      ? `${findString}${opts.insert || ''}`
      : `${opts.insert || ''}${findString}`
    return data.replace(findString, newContents)
  }

  return { update, append, prepend, replace, patch }
}

module.exports = attach
