import * as CLITable from 'cli-table3'
import * as importedColors from 'colors/safe'
import { commandInfo } from './meta-tools'
import { Toolbox } from '../domain/toolbox'
import { times } from './utils'
import { GluegunPrint, GluegunPrintColors, GluegunPrintTableOptions, TableStyle } from './print-types'

// We're extending `colors` with a few more attributes
const colors = importedColors as GluegunPrintColors
colors.setTheme({
  highlight: 'cyan',
  info: 'reset',
  warning: 'yellow',
  success: 'green',
  error: 'red',
  line: 'grey',
  muted: 'grey',
})

// Generate array of arrays of the data rows for length checking
// const getRows = t => times(flip(prop)(t), t.length)
const getRows = (t) => times((i) => t[i], t.length)

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
  middle: ' ',
}

const CLI_TABLE_MARKDOWN = {
  ...CLI_TABLE_COMPACT,
  left: '|',
  right: '|',
  middle: '|',
}

/**
 * Print a blank line.
 */
function newline() {
  console.log('')
}

/**
 * Prints a divider line
 */
function divider() {
  console.log(colors.line('---------------------------------------------------------------'))
}

/**
 * Returns an array of the column widths.
 *
 * @param cliTable Data table.
 * @returns Array of column widths
 */
function findWidths(cliTable: CLITable): number[] {
  return [(cliTable as any).options.head]
    .concat(getRows(cliTable))
    .reduce((colWidths, row) => row.map((str, i) => Math.max(`${str}`.length + 1, colWidths[i] || 1)), [])
}

/**
 * Returns an array of column dividers based on column widths, taking possible
 * paddings into account.
 *
 * @param cliTable Data table.
 * @returns Array of properly sized column dividers.
 */
function columnHeaderDivider(cliTable: CLITable, style: TableStyle = {}): string[] {
  const padding = (style['padding-left'] || 0) + (style['padding-right'] || 0)

  return findWidths(cliTable).map((w) => Array(w + padding).join('-'))
}

/**
 * Resets the padding of a table.
 *
 * @param cliTable Data table.
 */
function resetTablePadding(cliTable: CLITable) {
  const style = (cliTable as any).options.style

  if (style) {
    style['padding-left'] = 1
    style['padding-right'] = 1
  }
}

/**
 * Prints an object to table format.  The values will already be
 * stringified.
 *
 * @param object The object to turn into a table.
 */
function table(data: string[][], options: GluegunPrintTableOptions = {}): void {
  let t
  switch (options.format) {
    case 'markdown':
      // eslint-disable-next-line no-case-declarations
      const header = data.shift()
      t = new CLITable({
        head: header,
        chars: CLI_TABLE_MARKDOWN,
        style: options.style,
      })
      t.push(...data)
      t.unshift(columnHeaderDivider(t, options.style))
      resetTablePadding(t)
      break
    case 'lean':
      t = new CLITable({
        style: options.style,
      })
      t.push(...data)
      break
    default:
      t = new CLITable({
        chars: CLI_TABLE_COMPACT,
        style: options.style,
      })
      t.push(...data)
  }
  console.log(t.toString())
}

/**
 * Prints text without theming.
 *
 * Use this when you're writing stuff outside the toolbox of our
 * printing scheme.  hint: rarely.
 *
 * @param message The message to write.
 */
function fancy(message: any): void {
  console.log(message)
}

/**
 * Writes a normal information message.
 *
 * This is the default type you should use.
 *
 * @param message The message to show.
 */
function info(message: string): void {
  console.info(colors.info(message))
}

/**
 * Writes an error message.
 *
 * This is when something horribly goes wrong.
 *
 * @param message The message to show.
 */
function error(message: string): void {
  console.error(colors.error(message))
}

/**
 * Writes a warning message.
 *
 * This is when the user might not be getting what they're expecting.
 *
 * @param message The message to show.
 */
function warning(message: string): void {
  console.warn(colors.warning(message))
}

/**
 * Writes a debug message.
 *
 * This is for devs only.
 *
 * @param message The message to show.
 */
function debug(message: string, title = 'DEBUG'): void {
  const topLine = `vvv -----[ ${title} ]----- vvv`
  const botLine = `^^^ -----[ ${title} ]----- ^^^`

  console.debug(colors.rainbow(topLine))
  console.debug(message)
  console.debug(colors.rainbow(botLine))
}

/**
 * Writes a success message.
 *
 * When something is successful.  Use sparingly.
 *
 * @param message The message to show.
 */
function success(message: string): void {
  console.log(colors.success(message))
}

/**
 * Writes a highlighted message.
 *
 * To draw attention to specific lines.  Use sparingly.
 *
 * @param message The message to show.
 */
function highlight(message: string): void {
  console.log(colors.highlight(message))
}

/**
 * Writes a muted message.
 *
 * For ancillary info, something that's not the star of the show.
 *
 * @param message The message to show.
 */
function muted(message: string): void {
  console.log(colors.muted(message))
}

/**
 * Creates a spinner and starts it up.
 *
 * @param config The text for the spinner or an ora configuration object.
 * @returns The spinner.
 */
function spin(config?: string | object): any {
  return require('ora')(config || '').start()
}

/**
 * Prints the list of commands.
 *
 * @param toolbox The toolbox that was used
 * @param commandRoot Optional, only show commands with this root
 */
function printCommands(toolbox: Toolbox, commandRoot?: string[]): void {
  const data = commandInfo(toolbox, commandRoot)

  newline() // a spacer
  table(data) // the data
}

function printHelp(toolbox: Toolbox): void {
  const {
    runtime: { brand },
  } = toolbox
  info(`${brand} version ${toolbox.meta.version()}`)
  printCommands(toolbox)
}

const checkmark = colors.success('✔︎')
const xmark = colors.error('ⅹ')

const print: GluegunPrint = {
  colors,
  newline,
  divider,
  findWidths,
  columnHeaderDivider,
  table,
  fancy,
  info,
  error,
  warning,
  debug,
  success,
  highlight,
  muted,
  spin,
  printCommands,
  printHelp,
  checkmark,
  xmark,
}

export { print, GluegunPrint }
