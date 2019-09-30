import * as CLITable from 'cli-table3'
import * as importedColors from 'colors/safe'
import { commandInfo } from './meta-tools'
import { Toolbox } from '../domain/toolbox'
import { times } from './utils'
import { GluegunPrint, GluegunPrintColors } from './print-types'

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
const getRows = t => times(i => t[i], t.length)

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
 * Returns an array of column dividers based on column widths.
 *
 * @param cliTable Data table.
 * @returns Array of properly sized column dividers.
 */
function columnHeaderDivider(cliTable: CLITable): string[] {
  return findWidths(cliTable).map(w => Array(w).join('-'))
}

/**
 * Prints an object to table format.  The values will already be
 * stringified.
 *
 * @param object The object to turn into a table.
 */
function table(data: string[][], options: any = {}): void {
  let t
  switch (options.format) {
    case 'markdown':
      const header = data.shift()
      t = new CLITable({
        head: header,
        chars: CLI_TABLE_MARKDOWN,
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
        chars: CLI_TABLE_COMPACT,
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
  console.log(colors.info(message))
}

/**
 * Writes an error message.
 *
 * This is when something horribly goes wrong.
 *
 * @param message The message to show.
 */
function error(message: string): void {
  console.log(colors.error(message))
}

/**
 * Writes a warning message.
 *
 * This is when the user might not be getting what they're expecting.
 *
 * @param message The message to show.
 */
function warning(message: string): void {
  console.log(colors.warning(message))
}

/**
 * Writes a debug message.
 *
 * This is for devs only.
 *
 * @param message The message to show.
 */
function debug(message: string, title: string = 'DEBUG'): void {
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
 * @param message The message to show.
 */
function success(message: string): void {
  console.log(colors.success(message))
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
  spin,
  printCommands,
  printHelp,
  checkmark,
  xmark,
}

export { print, GluegunPrint }
