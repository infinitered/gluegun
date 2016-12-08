// @extension   hello
// @description Drops 'very' on the context.

/**
 * An extension that returns very little.
 */
module.exports = function (plugin, command, context) {
  return {
    very: 'little'
  }
}
