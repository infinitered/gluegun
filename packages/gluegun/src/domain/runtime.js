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
  const optionsIsArray = is(Array, options)

  // set initial context parameters, these will change further along
  // once we understand better what the user is looking for.
  if (isNilOrEmpty(options) || optionsIsArray) {
    // grab the params from the command line
    const { first, rest, options: parsedOptions } = parseCommandLine(
      options || process.argv
    )
    context.parameters.pluginName = first
    context.parameters.rawCommand = rest
    context.parameters.options = parsedOptions || {}
  } else {
    // grab the options that were passed in
    context.parameters.options = options.options || {}

    // did the user fill out the rawCommand but not the plug name?
    if (isBlank(options.pluginName) && !isBlank(options.rawCommand)) {
      // let's upgrade
      const upgrade = parseCommandLine(['', '', options.rawCommand])
      context.parameters.pluginName = upgrade.first
      context.parameters.rawCommand = upgrade.rest
    } else {
      context.parameters.pluginName = options.pluginName
      context.parameters.rawCommand = options.rawCommand
    }
  }

  // first check for a command inside the default
  const defaultPluginCommand = this.findCommand(
    this.defaultPlugin,
    context.parameters.pluginName || this.defaultCommand
  )
  if (defaultPluginCommand) {
    // we found a command in the default plugin
    context.plugin = this.defaultPlugin
    context.command = defaultPluginCommand
    context.parameters.pluginName = context.plugin.name
    context.parameters.rawCommand = `${context.plugin.name} ${context.parameters.rawCommand}`
  } else {
    // there wasn't a default command
    context.plugin = this.findPlugin(context.parameters.pluginName)
    context.command = this.findCommand(
      context.plugin,
      context.parameters.rawCommand
    )
  }

  // jet if we have no plugin
  if (isNil(context.plugin)) return context

  // setup the config
  context.config = clone(this.config)
  context.config[context.plugin.name] = merge(
    context.plugin.defaults,
    (this.defaults && this.defaults[context.plugin.name]) || {}
  )

  // jet if we have no command
  if (isNil(context.command)) return context

  // setup the rest of the parameters
  const subArgs = extractSubArguments(
    context.parameters.rawCommand,
    trim(context.command.name)
  )
  context.parameters.array = subArgs
  context.parameters.first = subArgs[0]
  context.parameters.second = subArgs[1]
  context.parameters.third = subArgs[2]
  context.parameters.string = join(COMMAND_DELIMITER, subArgs)

  // normalized params (experimental)
  const normalizedParams = normalizeParams(
    context.plugin.name,
    context.command.name,
    process.argv
  )

  context.params = Object.assign(normalizedParams, {
    plugin: context.plugin.name,
    command: context.command.name,
  })

  // kick it off
  if (context.command.run) {
    // attach extensions
    forEach(
      extension => {
        const extend = extension.setup(
          context.plugin,
          context.command,
          context
        )
        context[extension.name] = extend
      },
      this.extensions
    )

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
   * @param  {Object} options   Additional loading options.
   * @return {Plugin}           A plugin.
   */
  load (directory, options = {}) {
    const {
      brand,
      extensionNameToken,
      commandNameToken,
      commandDescriptionToken,
      commandHiddenToken,
      commandAliasToken
    } = this

    const plugin = loadPluginFromDirectory(directory, {
      extensionNameToken,
      commandNameToken,
      commandHiddenToken,
      commandAliasToken,
      commandDescriptionToken,
      brand,
      hidden: options['hidden'],
      name: options['name'],
      commandFilePattern: options['commandFilePattern'],
      extensionFilePattern: options['extensionFilePattern']
    })

    this.plugins = append(plugin, this.plugins)
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
   * @param {string} rawCommand  The command arguments to parse.
   * @returns {*}                A Command otherwise null.
   */
  findCommand (plugin, rawCommand) {
    if (isNil(plugin) || isBlank(rawCommand)) return null
    if (isNilOrEmpty(plugin.commands)) return null

    return find(
      command =>
        startsWith(command.name, rawCommand) || rawCommand === command.alias,
      plugin.commands
    )
  }
}

module.exports = autobind(Runtime)
