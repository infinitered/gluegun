const parseCommandLine = require('./parse-command-line')
const { forEach, map, pipe, propOr, tryCatch, always, concat } = require('ramda')
const jetpack = require('fs-jetpack')
const Runtime = require('../domain/runtime')
const getPluginsFromConfig = require('../loaders/plugins-from-config')
const homePluginDirectories = require('../loaders/home-plugin-directories')
const projectPluginDirectories = require('../loaders/project-plugin-directories')
const toml = require('toml')
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

  // --- PLUGINS #2 - $HOME/.${brand}/plugins/*
  forEach(
    runtime.load,
    homePluginDirectories(brand)
  )

  // --- PLUGINS #3 - in ./<brand>/plugins and ./<brand>/plugins-remote
  const projectBrandDir = `${cwd}/${brand}`
  forEach(
    runtime.load,
    projectPluginDirectories(projectBrandDir)
  )

  // --- PLUGINS #4 - in ./<brand>/<brand>.toml in the plugins key
  const morePlugins = map(
    concat(`${cwd}/${brand}/`),
    getPluginsFromConfig(`${projectBrandDir}/${brand}.toml`)
  )
  forEach(runtime.load, morePlugins)

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

  // wtf mode
  if (wtf) {
    printWtf(runtime)
    return
  }

  // print the header
  if (brand !== 'gluegun') {
    printBrandHeader(runtime, brandPlugin)
  }

  // let's do this!
  const context = await runtime.run(namespace, args, options)

  // print the command list
  if (!context.command) {
    printCommands(context, brandPlugin)
  }
}

run()
