const jetpack = require('fs-jetpack')
const os = require('os')
const path = require('path')

/**
 * Extensions to filesystem.  Brought to you by fs-jetpack.
 *
 * @return {Function} A function to attach to the context.
 */
function attach () {
  const extension = jetpack // jetpack
  extension.eol = os.EOL // end of line marker
  extension.separator = path.sep // path separator

  return extension
}

module.exports = attach
