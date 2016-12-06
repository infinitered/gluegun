const colors = require('colors')
const AsciiTable = require('ascii-table')
const { toLower } = require('ramda')

/**
 * The target output.  Terminal for now.
 */
const log = console.log

/**
 * Sets the color scheme.
 */
colors.setTheme({
  highlight: 'yellow',
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
  log('')
}

/**
 * Prints a divider line
 */
function divider () {
  log(colors.line('---------------------------------------------------------------'))
}

/**
 * Prints an object to table format.  The values will already be
 * stringified.
 *
 * @param {{}} object The object to turn into a table.
 */
function table (data, options) {
  const t = new AsciiTable()
  t.addRowMatrix(data)
  t.removeBorder()
  log(t.toString())
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
  log(message)
}

/**
 * Writes a normal information message.
 *
 * This is the default type you should use.
 *
 * @param {string} message The message to show.
 */
function info (message) {
  log(colors.info(message))
}

/**
 * Writes an error message.
 *
 * This is when something horribly goes wrong.
 *
 * @param {string} message The message to show.
 */
function error (message) {
  log(colors.error(message))
}

/**
 * Writes a warning message.
 *
 * This is when the user might not be getting what they're expecting.
 *
 * @param {string} message The message to show.
 */
function warning (message) {
  log(colors.warning(message))
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

  log(colors.rainbow(topLine))
  log(message)
  log(colors.rainbow(botLine))
}

/**
 * Writes a success message.
 *
 * When something is successful.  Use sparingly.
 *
 * @param {string} message The message to show.
 */
function success (message) {
  log(colors.success(message))
}

/**
 * Writes a step message.  Features or plugins can call this to indicate
 * something important is happening.
 *
 * @param {string} action  The action name (max 20 characters)
 * @param {string} message The message name (max 100 characters)
 */
function step (action, message) {
  const col1 = colors.info(toLower(action))
  const col2 = colors.highlight(message)
  const say = `${col1} ${col2}`
  log(say)
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
  colors,
  step
}
