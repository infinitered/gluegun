const jetpack = require('fs-jetpack')
// const { replace, forEach, keys } = require('ramda')
const { isFile } = require('../utils/filesystem-utils')

/**
 * Builds the code generation feature.
 *
 * @return {Function}           A function to attach to the context.
 */
function attach (plugin, command, context) {
  /**
   * Updates a text file or json config file.
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

    // check type of file
    const isJSON = filename.endsWith('.json')

    // read the file
    let contents
    if (isJSON) {
      contents = await jetpack.readAsync(filename, 'jsonWithDates')
    } else {
      contents = await jetpack.readAsync(filename, 'utf8')
    }

    // let the caller mutate the contents in memory
    const mutatedContents = callback(contents)

    // only write if they actually sent back something non-falsy
    if (mutatedContents) {
      await jetpack.writeAsync(filename, mutatedContents, { atomic: true })
    }

    // send back the rendered string
    return mutatedContents
  }

  return { update }
}

module.exports = attach
