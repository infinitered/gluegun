const parseCommandLine = require('../cli/parse-command-line')
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
  map
} = require('ramda')
const { findByProp, startsWith, isNilOrEmpty } = require('ramdasauce')
const { isBlank } = require('../utils/string-utils')
const { subdirectories, isDirectory } = require('../utils/filesystem-utils')
const RunContext = require('./run-context')
const loadPluginFromDirectory = require('../loaders/toml-plugin-loader')

// core extensions
const addTemplateExtension = require('../core-extensions/template-extension')
const addPrintExtension = require('../core-extensions/print-extension')
const addFilesystemExtension = require('../core-extensions/filesystem-extension')
const addSystemExtension = require('../core-extensions/system-extension')
const addPromptExtension = require('../core-extensions/prompt-extension')
const addHttpExtension = require('../core-extensions/http-extension')
const addStringsExtension = require('../core-extensions/strings-extension')

const COMMAND_DELIMITER = ' '

/**
 * Strips the command out of the args returns an array of the rest.
 *
 * @param {string} args        The full arguments including command.
 * @param {string} commandName The name of the command to strip.
 */
const extractSubArguments = (args, commandName) =>
  pipe(
    replace(commandName, ''),
    trim,
    split(COMMAND_DELIMITER),
    when(equals(['']), always([]))
  )(args)

/**
* Runs a command.
*
* @param  {{}} options Additional options use to execute a command.
*                      If nothing is passed, it will read from the command line.
* @return {RunContext} The RunContext object indicating what happened.
*/
async function run (options) {
  // prepare the run context
  const context = new RunContext()

  // attach the runtime
  context.runtime = this

  // prepare the context parameters
  if (isNilOrEmpty(options)) {
    // grab the params from the command line
    const { first, rest, options } = parseCommandLine(process.argv)
    context.parameters.pluginName = first
    context.parameters.rawCommand = rest
    context.parameters.options = options
  } else {
    // grab the options that were passed in
    context.parameters.pluginName = options.pluginName
    context.parameters.rawCommand = options.rawCommand
    context.parameters.options = options.options
  }

  // bring them back out for convenience
  const { pluginName, rawCommand } = context.parameters

  // try finding the command in the default plugin first
  const defaultPlugin = this.findCommand(this.defaultPlugin, rawCommand) && this.defaultPlugin

  // find the plugin
  const plugin = defaultPlugin || this.findPlugin(pluginName)

  if (!plugin) {
    return context
  }
  context.plugin = plugin

  // setup the config
  context.config = clone(this.defaults)
  context.config[plugin.name] = merge(plugin.defaults, this.defaults[plugin.pluginName] || {})

  // find the command
  const command = this.findCommand(plugin, rawCommand)

  if (command) {
    context.command = command
    // setup the rest of the parameters
    const subArgs = extractSubArguments(rawCommand, trim(command.name))
    context.parameters.array = subArgs
    context.parameters.first = subArgs[0]
    context.parameters.second = subArgs[1]
    context.parameters.third = subArgs[2]
    context.parameters.string = join(COMMAND_DELIMITER, subArgs)

    // kick it off
    if (command.run) {
      // attach extensions
      forEach(
        extension => {
          context[extension.name] = extension.setup(plugin, command, context)
        },
        this.extensions
      )

      try {
        context.result = await command.run(context)
      } catch (e) {
        context.error = e
      }
    }
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
    this.extensions = []
    this.defaults = {}
    this.defaultPlugin = null
    this.events = {}

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
    this.addExtension('system', addSystemExtension)
    this.addExtension('http', addHttpExtension)
    this.addExtension('prompt', addPromptExtension)
  }

  /**
   * Adds an extension so it is available when commands run. They live
   * as the given name on the context object passed to commands. The
   * 2nd parameter is a function that, when called, creates that object.
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
   * @return {Plugin}           A plugin.
   */
  load (directory) {
    const { brand, extensionNameToken, commandNameToken, commandDescriptionToken } = this

    const plugin = loadPluginFromDirectory(directory, {
      extensionNameToken,
      commandNameToken,
      commandDescriptionToken,
      brand
    })

    this.plugins = append(plugin, this.plugins)
    return plugin
  }

  /**
   * Loads a plugin from a directory and sets it as the default.
   *
   * @param  {string} directory The directory to load from.
   * @return {Plugin}           A plugin.
   */
  loadDefault (directory) {
    const plugin = this.load(directory)
    this.defaultPlugin = plugin
    return plugin
  }

  /**
   * Loads a bunch of plugins from the immediate sub-directories of a directory.
   *
   * @param {string} directory The directory to grab from.
   * @return {Plugin[]}        A bunch of plugins
   */
  loadAll (directory) {
    if (isBlank(directory) || !isDirectory(directory)) return []
    return pipe(
      subdirectories,
      map(this.load)
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
   * @param {string} rawCommand  The command arguments to parse.
   * @returns {*}                A Command otherwise null.
   */
  findCommand (plugin, rawCommand) {
    if (isNil(plugin) || isBlank(rawCommand)) return null
    if (isNilOrEmpty(plugin.commands)) return null

    return find(
      (command) => startsWith(command.name, rawCommand)
      , plugin.commands
      )
  }

}

module.exports = autobind(Runtime)
