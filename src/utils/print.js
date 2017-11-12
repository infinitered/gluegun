const colors = require('colors')
const { table: asciiTable, getBorderCharacters } = require('table')
const ora = require('ora')

/**
 * Sets the color scheme.
 */
colors.setTheme({
  highlight: 'cyan',
  info: 'reset',
  warning: 'yellow',
  success: 'green',
  error: 'red',
  line: 'grey',
  muted: 'grey'
})

/**
 * Print a blank line.
 */
function newline () {
  console.log('')
}

/**
 * Prints a divider line
 */
function divider () {
  console.log(
    colors.line(
      '---------------------------------------------------------------'
    )
  )
}

/**
 * Prints an object to table format.  The values will already be
 * stringified.
 *
 * @param {{}} object The object to turn into a table.
 */
function table (data, options) {
  let tableDesign
  if (options) {
    if (options.markdown) {
      // hopefully a new template coming soon
      // https://github.com/gajus/table/issues/53
      tableDesign = asciiTable(data, {
        border: {
          topBody: '',
          topJoin: '',
          topLeft: '',
          topRight: '',
          bottomBody: '',
          bottomJoin: '',
          bottomLeft: '',
          bottomRight: '',
          bodyLeft: '|',
          bodyRight: '|',
          bodyJoin: '|',
          joinBody: '-',
          joinLeft: '|',
          joinRight: '|',
          joinJoin: '|'
        },
        drawHorizontalLine: (index) => index === 1,
        ...options
      })
    } else {
      tableDesign = asciiTable(data, options)
    }
  } else {
    // default no frills table
    tableDesign = asciiTable(data, {border: getBorderCharacters(`void`), drawHorizontalLine: () => false})
  }
  console.log(tableDesign)
}

/**
 * Prints text without theming.
 *
 * Use this when you're writing stuff outside the context of our
 * printing scheme.  hint: rarely.
 *
 * @param {string} message The message to write.
 */
function fancy (message) {
  console.log(message)
}

/**
 * Writes a normal information message.
 *
 * This is the default type you should use.
 *
 * @param {string} message The message to show.
 */
function info (message) {
  console.log(colors.info(message))
}

/**
 * Writes an error message.
 *
 * This is when something horribly goes wrong.
 *
 * @param {string} message The message to show.
 */
function error (message) {
  console.log(colors.error(message))
}

/**
 * Writes a warning message.
 *
 * This is when the user might not be getting what they're expecting.
 *
 * @param {string} message The message to show.
 */
function warning (message) {
  console.log(colors.warning(message))
}

/**
 * Writes a debug message.
 *
 * This is for devs only.
 *
 * @param {string} message The message to show.
 */
function debug (message, title = 'DEBUG') {
  const topLine = `vvv -----[ ${title} ]----- vvv`
  const botLine = `^^^ -----[ ${title} ]----- ^^^`

  console.log(colors.rainbow(topLine))
  console.log(message)
  console.log(colors.rainbow(botLine))
}

/**
 * Writes a success message.
 *
 * When something is successful.  Use sparingly.
 *
 * @param {string} message The message to show.
 */
function success (message) {
  console.log(colors.success(message))
}

/**
   * Creates a spinner and starts it up.
   *
   * @param {string|Object} config The text for the spinner or an ora configuration object.
   * @returns The spinner.
   */
function spin(config) {
  return ora(config).start()
}

module.exports = {
  info,
  warning,
  success,
  error,
  debug,
  fancy,
  divider,
  newline,
  table,
  spin,
  colors
}
