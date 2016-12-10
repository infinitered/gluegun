const { create } = require('apisauce')

/**
 * An extension to talk to ye olde internet.
 *
 * @return {Function} A function to attach to the context.
 */
function attach () {
  return { create }
}

module.exports = attach
