const jetpack = require('fs-jetpack')
const { EOL } = require('os')
const { sep } = require('path')
const { subdirectories } = require('../utils/filesystem-utils')

/**
 * Extensions to filesystem.  Brought to you by fs-jetpack.
 *
 * @param  {RunContext} context The running context.
 */
function attach (context) {
  const extension = jetpack // jetpack
  extension.eol = EOL // end of line marker
  extension.separator = sep // path separator
  extension.subdirectories = subdirectories

  context.filesystem = extension
}

module.exports = attach
