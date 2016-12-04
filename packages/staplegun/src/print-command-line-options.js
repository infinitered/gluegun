import print from './print'
import { isNilOrEmpty } from 'ramdasauce'
import colors from 'colors'

/**
 * Prints the command line options & arguments the user typed.
 */
function printCommandLineOptions (namespace, args, options) {
  print.newline()
  print.freestyle(` ${colors.gray('namespace :')}  ${isNilOrEmpty(namespace) ? colors.red('none') : colors.yellow(namespace)}`)
  print.freestyle(`   ${colors.gray('command :')}  ${isNilOrEmpty(args) ? colors.red('none') : colors.yellow(args)}`)
  print.freestyle(`   ${colors.gray('options :')}  ${isNilOrEmpty(options) ? colors.red('none') : colors.yellow(JSON.stringify(options))}`)
  print.newline()
  print.divider()
}

export default printCommandLineOptions
