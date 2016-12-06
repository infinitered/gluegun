const parseCommandLine = require('./parse-command-line')
const { forEach, map } = require('ramda')
const { isBlank } = require('../utils/string-utils')
const jetpack = require('fs-jetpack')
const Runtime = require('../domain/runtime')
const loadPluginFromPackageJson = require('../loaders/package-json-plugin-loader')
const getPluginsFromPackage = require('../loaders/plugins-from-package')

// const print = require('../utils/print')
const printBanner = require('./print-banner')
const printCommands = require('./print-commands')
const printCommandLineOptions = require('./print-command-line-options')

/**
 * Our main entry point.
 *
 * This is async because our runtime execution is.
 */
async function run () {
  const key = 'staplegun'
  const commandFilePattern = 'commands/*.js'
  const cwd = jetpack.cwd()

  // parse the command line into what we need
  const { namespace, args, options } = parseCommandLine(process.argv)

  // create the runtime
  const runtime = new Runtime()

  // check the current directory for plugins
  const cwdPlugin = loadPluginFromPackageJson(cwd, { key, commandFilePattern })
  runtime.addPlugin(cwdPlugin)

  // grab more plugins that are listed in the package.json in the current directory
  const morePlugins = map(
    relativeDir => {
      const fullDir = `${cwd}/${relativeDir}`
      return loadPluginFromPackageJson(fullDir, { key, commandFilePattern })
    },
    getPluginsFromPackage(`${cwd}/package.json`, key)
  )

  // add them to the runtime
  forEach(runtime.addPlugin, morePlugins)

  // print what we're trying to do
  // TODO: divide run up into a query and an execution so we
  // have a better sense on if the command was found or not
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
