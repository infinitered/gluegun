import { GluegunToolbox } from '../index'
import * as CLITable from 'cli-table3'
import * as importedColors from 'colors'
import ora = require('ora')
import { Toolbox } from '../domain/toolbox'

export type GluegunPrintColors = typeof importedColors & {
  highlight: (t: string) => string
  info: (t: string) => string
  warning: (t: string) => string
  success: (t: string) => string
  error: (t: string) => string
  line: (t: string) => string
  muted: (t: string) => string
}

export interface GluegunPrint {
  /* Colors as seen from colors.js. */
  colors: GluegunPrintColors
  /* A green checkmark. */
  checkmark: string
  /* A red X marks the spot. */
  xmark: string
  /* Prints a message to stdout. */
  info: (message: any) => void
  /* Prints a warning-colored message. */
  warning: (message: any) => void
  /* Prints a success-colored message. */
  success: (message: any) => void
  /* Prints an error-colored message. */
  error: (message: any) => void
  /* Prints debug information about any data, with an optional title. */
  debug: (value: any, title?: string) => void
  /* DEPRECATED: prints a normal line of text. */
  fancy: (value: string) => void
  /* Prints a divider. */
  divider: () => void
  /* Finds the column widths for a table */
  findWidths: (cliTable: CLITable) => number[]
  /* Returns column header dividers for a table */
  columnHeaderDivider: (cliTable: CLITable) => string[]
  /* Prints a newline. */
  newline: () => void
  /* Prints a table of data (usually a 2-dimensional array). */
  table: (data: any, options?: any) => void
  /* An `ora`-powered spinner. */
  spin(options?: ora.Options | string): ora.Ora
  /* Print help info for known CLI commands. */
  printCommands(toolbox: Toolbox, commandRoot?: string[]): void
  /* Prints help info, including version and commands. */
  printHelp(toolbox: GluegunToolbox): void
}
