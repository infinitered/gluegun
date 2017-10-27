const { create } = require('apisauce')

/**
 * An extension to talk to ye olde internet.
 *
 * @param  {RunContext} context The running context.
 */
function attach (context) {
  context.http = { create }
}

module.exports = attach
