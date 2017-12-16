const print = require('../utils/print')
const { printHelp, printCommands } = require('../utils/print-help')

/**
 * Extensions to print to the console.
 *
 * @param  {RunContext} context The running context.
 */
function attach (context) {
  const { colors, debug } = print
  const checkmark = colors.success('✔︎')
  const xmark = colors.error('ⅹ')

  /**
   * Prints an informational message.  Use this as your goto.
   */
  function info (message) {
    print.info(message)
  }

  /**
   * Prints a warning message.  Use this when you feel a disturbance in the force.
   */
  function warning (message) {
    print.warning(message)
  }

  /**
   * Prints an error message.  Use this when something goes Pants-On-Head wrong.
   * What does that mean?  Well, if your next line of code isn't process.exit(0), then
   * it was probably a warning.
   */
  function error (message) {
    print.error(message)
  }

  /**
   * Prints a success message.  Use this when something awesome just happened.
   */
  function success (message) {
    print.success(message)
  }

  /**
   * Creates a spinner and starts it up.
   *
   * @param {string|Object} config The text for the spinner or an ora configuration object.
   * @returns The spinner.
   */
  function spin (config) {
    return print.spin(config)
  }

  // attach the feature set
  context.print = {
    info,
    warning,
    error,
    success,
    debug,
    colors,
    checkmark,
    xmark,
    spin,
    printHelp,
    printCommands,
    table: print.table,
    newline: print.newline,
    color: colors
  }
}

module.exports = attach
