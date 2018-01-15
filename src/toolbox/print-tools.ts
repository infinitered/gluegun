import * as CLITable from 'cli-table2'
import * as colors from 'colors'
import { commandInfo } from './meta-tools'
import { RunContext } from '../domain/run-context'
import * as ora from 'ora'

export { colors }

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
 * Sets the color scheme.
 */
colors.setTheme({
  highlight: 'cyan',
  info: 'reset',
  warning: 'yellow',
  success: 'green',
  error: 'red',
  line: 'grey',
  muted: 'grey',
})

/**
 * Print a blank line.
 */
export function newline() {
  console.log('')
}

/**
 * Prints a divider line
 */
export function divider() {
  console.log(colors.line('---------------------------------------------------------------'))
}

/**
 * Returns an array of the column widths.
 *
 * @param cliTable Data table.
 * @returns Array of column widths
 */
export function findWidths(cliTable: CLITable): number[] {
  return [(cliTable as any).options.head]
    .reduce((colWidths, row) => row.map((str, i) => Math.max(`${str}`.length + 1, colWidths[i] || 1)), [])
}

/**
 * Returns an array of column dividers based on column widths.
 *
 * @param cliTable Data table.
 * @returns Array of properly sized column dividers.
 */
export function columnHeaderDivider(cliTable: CLITable): string[] {
  return findWidths(cliTable).map(w => Array(w).join('-'))
}

/**
 * Prints an object to table format.  The values will already be
 * stringified.
 *
 * @param object The object to turn into a table.
 */
export function table(data: string[][], options: any = {}): void {
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
 * Use this when you're writing stuff outside the context of our
 * printing scheme.  hint: rarely.
 *
 * @param message The message to write.
 */
export function fancy(message: string): void {
  console.log(message)
}

/**
 * Writes a normal information message.
 *
 * This is the default type you should use.
 *
 * @param message The message to show.
 */
export function info(message: string): void {
  console.log(colors.info(message))
}

/**
 * Writes an error message.
 *
 * This is when something horribly goes wrong.
 *
 * @param message The message to show.
 */
export function error(message: string): void {
  console.log(colors.error(message))
}

/**
 * Writes a warning message.
 *
 * This is when the user might not be getting what they're expecting.
 *
 * @param message The message to show.
 */
export function warning(message: string): void {
  console.log(colors.warning(message))
}

/**
 * Writes a debug message.
 *
 * This is for devs only.
 *
 * @param message The message to show.
 */
export function debug(message: string, title: string = 'DEBUG'): void {
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
export function success(message: string): void {
  console.log(colors.success(message))
}

/**
 * Creates a spinner and starts it up.
 *
 * @param config The text for the spinner or an ora configuration object.
 * @returns The spinner.
 */
export function spin(config?: string | object): any {
  return ora(config || '').start()
}

/**
 * Prints the list of commands.
 *
 * @param context The context that was used
 * @param commandRoot Optional, only show commands with this root
 */
export function printCommands(context: RunContext, commandRoot?: string[]): void {
  let printPlugins = []
  if (context.plugin === context.defaultPlugin) {
    // print for all plugins
    printPlugins = context.plugins
  } else {
    // print for one plugin
    printPlugins = [context.plugin]
  }

  const data = commandInfo(context, printPlugins, commandRoot)

  newline() // a spacer
  table(data) // the data
}

export function printHelp(context: RunContext): void {
  const { runtime: { brand } } = context
  info(`${brand} version ${context.meta.version()}`)
  printCommands(context)
}

export const checkmark = colors.success('✔︎')
export const xmark = colors.error('ⅹ')
