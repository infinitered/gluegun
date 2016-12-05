const parseCommandLine = require('./parse-command-line')
const { forEach } = require('ramda')
const { isBlank } = require('./utils')
const jetpack = require('fs-jetpack')
const getPluginDirectoriesFromPackage = require('./plugins-from-package')
const Runtime = require('./runtime')
// const print = require('./print')
const printBanner = require('./print-banner')
const printCommands = require('./print-commands')
const printCommandLineOptions = require('./print-command-line-options')

/**
 * Our main entry point.
 *
 * This is async because our runtime execution is.
 */
async function run () {
  // parse the command line into what we need
  const { namespace, args, options } = parseCommandLine()

  // create the runtime
  const runtime = new Runtime()

  // add any plugins for the current directory
  runtime.addPluginFromDirectory(jetpack.cwd())

  // add any plugins from the package.json in the current directory too
  forEach(
    runtime.addPluginFromDirectory,
    getPluginDirectoriesFromPackage(jetpack.cwd())
  )

  printCommandLineOptions(namespace, args, options)

  // let's do this!
  const context = await runtime.run(namespace, args, options)

  // print
  if (isBlank(namespace)) {
    printBanner()
  }

  if (isBlank(context.fullArguments)) {
    printCommands(runtime)
  }

  // print.debug(context, 'run context')
}

run()
