const parseCommandLine = require('./parse-command-line')
const { forEach, map, pipe, propOr, tryCatch } = require('ramda')
const { isBlank } = require('../utils/string-utils')
const { isDirectory } = require('../utils/filesystem-utils')
const jetpack = require('fs-jetpack')
const Runtime = require('../domain/runtime')
const loadPluginFromDirectory = require('../loaders/toml-plugin-loader')
const getPluginsFromConfig = require('../loaders/plugins-from-config')
const toml = require('toml')

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
  const cwd = jetpack.cwd()

  // parse the command line into what we need
  let {
    namespace,
    args,
    options,
    brand = 'gluegun'
  } = parseCommandLine(process.argv)

  // create the runtime
  const runtime = new Runtime(brand)

  // check the current directory for plugins
  const cwdPlugin = loadPluginFromDirectory(cwd, { brand })
  runtime.addPlugin(cwdPlugin)

  // check for a branded directory for plugins
  const brandSubdir = `${cwd}/${brand}`
  if (isDirectory(brandSubdir)) {
    const cwdBrandPlugin = loadPluginFromDirectory(brandSubdir, { brand, namespace: 'project' })
    runtime.addPlugin(cwdBrandPlugin)
  }

  // grab more plugins that are listed in the package.json in the current directory
  const morePlugins = map(
    relativeDir => {
      const fullDir = `${cwd}/${relativeDir}`
      return loadPluginFromDirectory(fullDir, { brand })
    },
    getPluginsFromConfig(`${cwd}/${brand}.toml`)
  )

  // add them to the runtime
  forEach(runtime.addPlugin, morePlugins)

  // load the config
  runtime.defaults = pipe(
    jetpack.read,
    tryCatch(toml.parse, {}),
    propOr({}, 'defaults')
    )(`${cwd}/${brand}.toml`)

  // in branded mode, let's see if there's match prepending the
  // branded namespace to the front and searching for a command
  const brandPlugin = runtime.findPlugin(brand)
  const foundCommand = runtime.findCommand(brandPlugin, `${namespace} ${args}`)
  // we found a short cut via the brand, so let's doctor the input to target the right thing
  if (foundCommand) {
    args = `${namespace} ${args}`
    namespace = brand
  }

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

  if (isBlank(context.parameters.string)) {
    printCommands(runtime)
  }

  // print.debug(context, 'run context')
}

run()
