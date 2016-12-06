const print = require('../utils/print')
const { toLower } = require('ramda')
// const { rightPad } = require('../utils/string-utils')

/**
 * Extensions to print to the console.
 *
 * @param  {Plugin}     plugin  The plugin that triggered.
 * @param  {Command}    command The current command that is running.
 * @param  {RunContext} context The running context.
 * @return {Function}           A function to attach to the context.
 */
function attach (plugin, command, context) {
  const { colors, debug } = print
  const colDivide = colors.muted('>')
  const checkmark = colors.success('✔︎')
  // const xmark = colors.error('ⅹ')

  /**
   * Prints when a step has completed.
   *
   * @param {string} action  The verb that just happened.
   * @param {string} message The message to say.
   */
  function stepComplete (action, message) {
    // const colNamespaceCommand = rightPad(0, ' ', `${plugin.namespace} ${command.name}`)
    const col1 = toLower(action)
    const col2 = colors.highlight(message)
    const say = ` ${checkmark} ${col1} ${colDivide} ${col2}`

    print.fancy(say)
  }

  // return back the feature set
  return {
    stepComplete,
    colors,
    color: colors,
    debug
  }
}

module.exports = attach
