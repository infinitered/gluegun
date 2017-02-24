const jetpack = require('fs-jetpack')
const print = require('../utils/print')
const {
  identity,
  replace,
  prop,
  pipe,
  filter,
  propEq,
  any,
  forEach,
  cond,
  always,
  equals,
  sortBy,
  concat
} = require('ramda')

/**
 * Does this have a loadState error?
 */
const hasLoadStateError = propEq('loadState', 'error')

/**
 * Does this plugin have any problems?
 *
 * @param  {Plugin} plugin The plugin to check
 * @return {bool}          `true` if problems otherwise `false`
 */
const hasProblem = plugin =>
  hasLoadStateError(plugin) ||
  any(hasLoadStateError, plugin.commands) ||
  any(hasLoadStateError, plugin.extensions)

/**
 * Provides a human explanation of the plugin error.
 *
 * @param  {string} errorState The error state
 * @return {string}
 */
const humanizePluginError = cond([
  [equals('ok'), identity],
  [equals('missingdir'), always('Missing Directory')],
  [equals('badname'), always('Invalid Name')],
  [always, concat('Unknown Error - ')]
])

/**
 * Provides a human explanation of the command error.
 *
 * @param  {string} errorState The error state
 * @return {string}
 */
const humanizeCommandError = cond([
  [equals('ok'), identity],
  [equals('missingdir'), always('Missing Directory')],
  [equals('badfunction'), always('Problem with function')],
  [equals('badfile'), always('Problem parsing file')],
  [always, concat('Unknown Error - ')]
])

/**
 * Prints debug information about the runtime.
 */
module.exports = function (runtime) {
  print.newline()

  const cwdslash = jetpack.cwd() + '/'

  // grab the printable errors
  const printable = pipe(filter(hasProblem), sortBy(prop('name')))(
    runtime.plugins
  )

  // and print!
  forEach(
    plugin => {
      // find the relative directory
      const pluginRelativeDir = replace(cwdslash, '', plugin.directory)

      // start with a divider to see between plugins
      print.divider()

      // print some information about the plugin
      const pluginWriter = hasProblem(plugin)
        ? print.colors.error
        : print.colors.success
      const problemDescription = plugin.errorState !== 'none'
        ? print.colors.error(`-- ${humanizePluginError(plugin.errorState)}`)
        : ''
      print.fancy(
        print.colors.muted('plugin ') +
          pluginWriter(`${plugin.name} ${problemDescription}`)
      )
      print.info('  ' + pluginRelativeDir)
      print.newline()

      // print the extensions
      forEach(
        extension => {
          // print the name (with optional error message)
          const colorWriter = hasLoadStateError(extension)
            ? print.colors.error
            : print.colors.success
          const commandErrorDescription = extension.errorState !== 'none'
            ? print.colors.error(
                `-- ${humanizeCommandError(extension.errorState)}`
              )
            : ''
          print.fancy(
            print.colors.muted('extension ') +
              colorWriter(`${extension.name} ${commandErrorDescription}`)
          )

          // the directory
          print.info(
            '  ' +
              pluginRelativeDir +
              '/' +
              replace(plugin.directory + '/', '', extension.file)
          )

          // print the exception if we have one
          if (extension.exception) {
            print.newline()
            console.dir(extension.exception)
          }

          print.newline()
        },
        filter(hasLoadStateError, plugin.extensions)
      )

      // print the commands
      forEach(
        command => {
          // print the name (with optional error message)
          const colorWriter = hasLoadStateError(command)
            ? print.colors.error
            : print.colors.success
          const commandErrorDescription = command.errorState !== 'none'
            ? print.colors.error(
                `-- ${humanizeCommandError(command.errorState)}`
              )
            : ''
          print.fancy(
            print.colors.muted('command ') +
              colorWriter(`${command.name} ${commandErrorDescription}`)
          )

          // the description if we have one
          if (command.description) {
            print.info(`  ${print.colors.muted(command.description)}`)
          }
          // the directory
          print.info(
            '  ' +
              pluginRelativeDir +
              '/' +
              replace(plugin.directory + '/', '', command.file)
          )

          // the exception if any
          if (command.exception) {
            print.newline()
            console.dir(command.exception)
          }

          print.newline()
        },
        filter(hasLoadStateError, plugin.commands)
      )
    },
    printable
  )
}
