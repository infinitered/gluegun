const colors = require('colors')
const ora = require('ora')
const CLITable = require('cli-table2')

const CLI_TABLE_COMPACT = {
  top: '',
  'top-mid': '',
  'top-left': '',
  'top-right': '',
  bottom: '',
  'bottom-mid': '',
  'bottom-left': '',
  'bottom-right': '',
  left: ' ',
  'left-mid': '',
  mid: '',
  'mid-mid': '',
  right: '',
  'right-mid': '',
  middle: ' '
}

const CLI_TABLE_MARKDOWN = Object.assign({}, CLI_TABLE_COMPACT, {
  left: '|',
  right: '|',
  middle: '|'
})

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
  console.log(colors.line('---------------------------------------------------------------'))
}

/**
 * Returns an array of the column widths.
 */
function findWidths (table) {
  return [table.options.head, ...table].reduce(
    (colWidths, row) => row.map((str, i) => Math.max(`${str}`.length + 1, colWidths[i] || 1)),
    []
  )
}

/**
 * Returns an array of column headers based on column widths.
 */
function columnHeaderDivider (table) {
  return findWidths(table).map(w => Array(w).join('-'))
}

/**
 * Prints an object to table format.  The values will already be
 * stringified.
 *
 * @param {{}} object The object to turn into a table.
 */
function table (data, options) {
  let t
  switch (options && options.format) {
    case 'markdown':
      const header = data.shift()
      t = new CLITable({
        head: header,
        chars: CLI_TABLE_MARKDOWN
      })
      t.push(...data)
      t.unshift(columnHeaderDivider(t))
      break
    case 'lean':
      t = new CLITable()
      t.push(...data)
      break
    default:
      t = new CLITable({
        chars: CLI_TABLE_COMPACT
      })
      t.push(...data)
  }
  console.log(t.toString())
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
function spin (config) {
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
