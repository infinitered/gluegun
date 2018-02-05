import { GluegunRunContext } from '../index'

export interface GluegunPrint {
  /* Colors as seen from colors.js. */
  colors: any
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
  /* Prints a newline. */
  newline: () => void
  /* Prints a table of data (usually a 2-dimensional array). */
  table: (data: any, options: any) => void
  /* An `ora`-powered spinner. */
  spin(options: any): any
  /* Print help info for known CLI commands. */
  printCommands(context: GluegunRunContext): void
}
