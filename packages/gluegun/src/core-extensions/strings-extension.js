const stringUtils = require('../utils/string-utils')

/**
 * Attaches some string helpers for convenience.
 *
 * @return {Function} A function to attach to the context.
 */
function attach (plugin, command, context) {
  return stringUtils
}

module.exports = attach
