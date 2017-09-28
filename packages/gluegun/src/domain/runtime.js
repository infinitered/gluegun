const parseCommandLine = require('../cli/parse-command-line')
const normalizeParams = require('../cli/normalize-params')
const autobind = require('autobind-decorator')
const {
  clone,
  merge,
  when,
  equals,
  always,
  join,
  split,
  trim,
  pipe,
  replace,
  find,
  append,
  forEach,
  isNil,
  dissoc,
  map,
  is
} = require('ramda')
const { findByProp, startsWith, isNilOrEmpty } = require('ramdasauce')
const { isBlank } = require('../utils/string-utils')
const { subdirectories, isDirectory } = require('../utils/filesystem-utils')
const RunContext = require('./run-context')
const loadPluginFromDirectory = require('../loaders/toml-plugin-loader')

// core extensions
const addTemplateExtension = require('../core-extensions/template-extension')
const addPrintExtension = require('../core-extensions/print-extension')
const addFilesystemExtension = require(
  '../core-extensions/filesystem-extension'
)
const addSemverExtension = require('../core-extensions/semver-extension')
const addSystemExtension = require('../core-extensions/system-extension')
const addPromptExtension = require('../core-extensions/prompt-extension')
const addHttpExtension = require('../core-extensions/http-extension')
const addStringsExtension = require('../core-extensions/strings-extension')
const addPatchingExtension = require('../core-extensions/patching-extension')

const COMMAND_DELIMITER = ' '

/**
* Runs a command.
*
* @param  {string} rawCommand Command string.
* @param  {{}} options Additional options use to execute a command.
* @return {RunContext} The RunContext object indicating what happened.
*/
async function run (rawCommand, options) {
  // prepare the run context
  const context = new RunContext()

  // attach the runtime
  context.runtime = this

  // use the command line args if not passed in
  let commandArray = rawCommand || process.argv
  if (is(String, commandArray)) { commandArray = commandArray.split(COMMAND_DELIMITER) }

  // remove the first 2 args if it comes from process.argv
  if (commandArray[0] && commandArray[0].endsWith('/bin/node')) { commandArray = commandArray.slice(2) }

  // find the pluginName and commandName from the cli args
  let commandName = commandArray[0]
  if (!commandName) {
    // if no first arg, we want to go for the default, which is named the same as the plugin
    context.pluginName = this.brand
    context.commandName = this.brand
    context.plugin = this.defaultPlugin
  } else if (this.pluginNames.includes(commandName)) {
    // this is the name of a plugin, so let's set that, and try with the second argument
    context.pluginName = commandName
    // set to the second argument, or back to the plugin name (for default command)
    context.commandName = commandArray[1] || commandName
  } else {
    // it's one of our default commands...probably
    context.pluginName = this.brand
    context.commandName = commandName
  }

  context.plugin = context.plugin || this.findPlugin(context.pluginName)
  context.command = this.findCommand(context.plugin, context.commandName)

  // jet if we have no plugin or command
  if (isNil(context.plugin) || isNil(context.command)) return context

  // setup the config
  context.config = clone(this.config)
  context.config[context.plugin.name] = merge(
    context.plugin.defaults,
    (this.defaults && this.defaults[context.plugin.name]) || {}
  )

  // normalized parameters
  context.parameters = normalizeParams(
    context.plugin.name,
    context.command.name,
    commandArray
  )
  context.parameters.options = merge(context.parameters.options, options || {})

  // kick it off
  if (context.command.run) {
    // allow extensions to attach themselves to the context
    forEach(extension => extension.setup(context), this.extensions)

    // run the command
    context.result = await context.command.run(context)
  }

  return context
}

/**
 * Loads plugins an action through the gauntlet.
 */
class Runtime {
  /**
   * Create and initialize an empty Runtime.
   */
  constructor (brand) {
    this.brand = brand
    this.run = run // awkward because node.js doesn't support async-based class functions yet.
    this.plugins = []
    this.pluginNames = []
    this.extensions = []
    this.defaults = {}
    this.defaultPlugin = null
    this.events = {}
    this.config = {}

    this.addCoreExtensions()
  }

  /**
   * Adds the core extensions.  These provide the basic features
   * available in gluegun, but follow the exact same method
   * for extending the core as 3rd party extensions do.
   */
  addCoreExtensions () {
    this.addExtension('strings', addStringsExtension)
    this.addExtension('print', addPrintExtension)
    this.addExtension('template', addTemplateExtension)
    this.addExtension('filesystem', addFilesystemExtension)
    this.addExtension('semver', addSemverExtension)
    this.addExtension('system', addSystemExtension)
    this.addExtension('http', addHttpExtension)
    this.addExtension('prompt', addPromptExtension)
    this.addExtension('patching', addPatchingExtension)
  }

  /**
   * Adds an extension so it is available when commands run. They usually live
   * as the given name on the context object passed to commands, but are able
   * to manipulate the context object however they want. The second
   * parameter is a function that allows the extension to attach itself.
   *
   * @param {string} name   The context property name.
   * @param {object} setup  The setup function.
   */
  addExtension (name, setup) {
    this.extensions.push({ name, setup })
    return this
  }

  /**
   * Loads a plugin from a directory.
   *
   * @param  {string} directory The directory to load from.
   * @param  {Object} options   Additional loading options.
   * @return {Plugin}           A plugin.
   */
  load (directory, options = {}) {
    const { brand } = this

    const plugin = loadPluginFromDirectory(directory, {
      brand,
      hidden: options['hidden'],
      name: options['name'],
      commandFilePattern: options['commandFilePattern'],
      extensionFilePattern: options['extensionFilePattern']
    })

    this.plugins = append(plugin, this.plugins)
    this.pluginNames = append(plugin.name, this.pluginNames)
    forEach(
      extension => this.addExtension(extension.name, extension.setup),
      plugin.extensions
    )
    return plugin
  }

  /**
   * Loads a plugin from a directory and sets it as the default.
   *
   * @param  {string} directory The directory to load from.
   * @param  {Object} options   Additional loading options.
   * @return {Plugin}           A plugin.
   */
  loadDefault (directory, options = {}) {
    const plugin = this.load(directory, options)
    this.defaultPlugin = plugin
    return plugin
  }

  /**
   * Loads a bunch of plugins from the immediate sub-directories of a directory.
   *
   * @param {string} directory The directory to grab from.
   * @param {Object} options   Addition loading options.
   * @return {Plugin[]}        A bunch of plugins
   */
  loadAll (directory, options = {}) {
    if (isBlank(directory) || !isDirectory(directory)) return []
    return pipe(
      dir => subdirectories(dir, false, options['matching'], true),
      map(dir => this.load(dir, dissoc('matching', options)))
    )(directory)
  }

  /**
   * The list of commands registered.
   *
   * @return {[]} A list of [{plugin, command}]
   */
  listCommands () {
    const commands = []
    const eachPlugin = plugin => {
      const eachCommand = command => {
        commands.push({ plugin, command })
      }
      forEach(eachCommand, plugin.commands)
    }
    forEach(eachPlugin, this.plugins)

    return commands
  }

  /**
   * Find the plugin for this name.
   *
   * @param {string} name The name to search through.
   * @returns {*}         A Plugin otherwise null.
   */
  findPlugin (name) {
    return findByProp('name', name || '', this.plugins)
  }

  /**
   * Find the command for this pluginName & command.
   *
   * @param {Plugin} plugin      The plugin in which the command lives.
   * @param {string} commandName     The command to find.
   * @returns {*}                A Command otherwise null.
   */
  findCommand (plugin, commandName) {
    if (isNil(plugin) || isBlank(commandName)) return null
    if (isNilOrEmpty(plugin.commands)) return null

    return find(
      command => {
        const aliases = is(Array, command.alias) ? command.alias : [ command.alias ]
        aliases.push(command.name)
        return aliases.includes(commandName)
      },
      plugin.commands
    )
  }
}

module.exports = autobind(Runtime)
