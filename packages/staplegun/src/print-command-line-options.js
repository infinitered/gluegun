const print = require('./print')
const { isNilOrEmpty } = require('ramdasauce')
const colors = require('colors')

/**
 * Prints the command line options & arguments the user typed.
 */
function printCommandLineOptions (namespace, args, options) {
  print.newline()
  print.fancy(` ${colors.gray('namespace :')}  ${isNilOrEmpty(namespace) ? colors.red('none') : colors.yellow(namespace)}`)
  print.fancy(`   ${colors.gray('command :')}  ${isNilOrEmpty(args) ? colors.red('none') : colors.yellow(args)}`)
  print.fancy(`   ${colors.gray('options :')}  ${isNilOrEmpty(options) ? colors.red('none') : colors.yellow(JSON.stringify(options))}`)
  print.newline()
  print.divider()
}

module.exports = printCommandLineOptions
