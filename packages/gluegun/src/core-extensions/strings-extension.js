const stringUtils = require('../utils/string-utils')

/**
 * Attaches some string helpers for convenience.
 *
 * @param  {RunContext} context The running context.
 */
function attach (context) {
  context.strings = stringUtils
}

module.exports = attach
