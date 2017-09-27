const jetpack = require('fs-jetpack')
const os = require('os')
const path = require('path')
const { subdirectories } = require('../utils/filesystem-utils')

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
