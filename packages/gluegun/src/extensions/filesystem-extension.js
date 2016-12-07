const jetpack = require('fs-jetpack')

/**
 * Extensions to filesystem.  Brought to you by fs-jetpack.
 *
 * @param  {Plugin}     plugin  The plugin that triggered.
 * @param  {Command}    command The current command that is running.
 * @param  {RunContext} context The running context.
 * @return {Function}           A function to attach to the context.
 */
function attach (plugin, command, context) {
  return jetpack
}

module.exports = attach
