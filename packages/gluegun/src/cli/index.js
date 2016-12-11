const parseCommandLine = require('./parse-command-line')
const { forEach, map, pipe, propOr, tryCatch, always } = require('ramda')
const { isBlank } = require('../utils/string-utils')
const { isDirectory } = require('../utils/filesystem-utils')
const jetpack = require('fs-jetpack')
const Runtime = require('../domain/runtime')
const loadPluginFromDirectory = require('../loaders/toml-plugin-loader')
const getPluginsFromConfig = require('../loaders/plugins-from-config')
const homePluginDirectories = require('../loaders/home-plugin-directories')
const toml = require('toml')
// const printBanner = require('./print-banner')
const printCommands = require('./print-commands')
const printWtf = require('./print-wtf')
const printBrandHeader = require('./print-brand-header')

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
    brand = 'gluegun',
    wtf
  } = parseCommandLine(process.argv)

  // create the runtime
  const runtime = new Runtime(brand)

  // --- PLUGINS #1 - core plugins
  runtime.addPlugin(loadPluginFromDirectory(`${__dirname}/../core-plugins/spork`))

  // --- PLUGINS #2 - current working directory
  const cwdPlugin = loadPluginFromDirectory(cwd, { brand })
  runtime.addPlugin(cwdPlugin)

  // --- PLUGINS #3 - current working directory's branded subdir
  const projectBrandDir = `${cwd}/${brand}`
  if (isDirectory(projectBrandDir)) {
    runtime.addPlugin(
      loadPluginFromDirectory(projectBrandDir, { brand, namespace: 'project' })
    )
  }

  // --- PLUGINS #4 - ones specified in the config file
  const morePlugins = map(
    relativeDir => {
      const fullDir = `${cwd}/${relativeDir}`
      return loadPluginFromDirectory(fullDir, { brand })
    },
    getPluginsFromConfig(`${cwd}/${brand}.toml`)
  )
  forEach(runtime.addPlugin, morePlugins)

  // --- PLUGINS #5 - the user's $HOME/.${brand}/plugins/*
  forEach(
    dir => runtime.addPlugin(loadPluginFromDirectory(dir, { brand })),
    homePluginDirectories(brand)
  )

  // load the config
  runtime.defaults = pipe(
    jetpack.read,
    tryCatch(toml.parse, always({})),
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

  // wtf mode
  if (wtf) {
    printWtf(runtime)
    return
  }

  // let's do this!
  const context = await runtime.run(namespace, args, options)

  // print
  if (isBlank(namespace)) {
    if (brand === 'gluegun') {
      // printBanner()
    } else {
      printBrandHeader(runtime, brandPlugin)
    }
  }

  if (!context.command) {
    printCommands(context, brandPlugin)
  }
}

run()
