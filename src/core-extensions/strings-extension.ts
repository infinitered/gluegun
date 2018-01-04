const stringTools = require('../toolbox/string-tools')

/**
 * Attaches some string helpers for convenience.
 *
 * @param  {RunContext} context The running context.
 */
function attach(context) {
  context.strings = stringTools
}

module.exports = attach
