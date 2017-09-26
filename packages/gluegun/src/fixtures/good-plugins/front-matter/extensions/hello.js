// @gluegunExtensionName hello

/**
 * An extension that returns very little.
 */
module.exports = function (plugin, command, context) {
  return {
    very: 'little'
  }
}
