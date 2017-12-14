const { parseParams, createParams } = require('../utils/cli/normalize-params')
const {
  clone,
  merge,
  equals,
  pipe,
  find,
  append,
  forEach,
  isNil,
  dissoc,
  map,
  is,
  reduce,
  sort,
  pluck
} = require('ramda')
const { findByProp, isNilOrEmpty } = require('ramdasauce')
const { isBlank } = require('../utils/string-utils')
const { subdirectories, isDirectory } = require('../utils/filesystem-utils')
const RunContext = require('./run-context')
const { loadPluginFromDirectory } = require('../loaders/plugin-loader')
const { resolve } = require('path')

// core extensions
const addTemplateExtension = require('../core-extensions/template-extension')
const addPrintExtension = require('../core-extensions/print-extension')
const addFilesystemExtension = require('../core-extensions/filesystem-extension')
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
 * @param  {{}} extraOptions Additional options use to execute a command.
 * @return {RunContext} The RunContext object indicating what happened.
 */
async function run (rawCommand, extraOptions) {
  // prepare the run context
  const context = new RunContext()

  // attach the runtime
  context.runtime = this

  // use the command line args if not passed in
  let commandArray = rawCommand || process.argv
  if (is(String, commandArray)) {
    commandArray = commandArray.split(COMMAND_DELIMITER)
  }

  // remove the first 2 args if it comes from process.argv
  if (equals(commandArray, process.argv)) {
    commandArray = commandArray.slice(2)
  }

  // parse the parameters initially
  context.parameters = parseParams(commandArray, extraOptions)

  // find the plugin and command, and parse out aliases
  const { plugin, command, array } = this.findCommand(context.parameters.array)

  // jet if we have no plugin or command
  if (isNil(plugin) || isNil(command)) return context

  // set a few properties
  context.plugin = plugin
  context.command = command
  context.pluginName = plugin.name
  context.commandName = command.name

  // rebuild the parameters, now that we know the plugin and command
  context.parameters = createParams({
    plugin: context.plugin.name,
    command: context.command.name,
    array: array,
    options: context.parameters.options,
    raw: commandArray,
    argv: process.argv
  })

  // setup the config
  context.config = clone(this.config)
  context.config[context.plugin.name] = merge(
    context.plugin.defaults,
    (this.defaults && this.defaults[context.plugin.name]) || {}
  )

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
    this.extensions = []
    this.defaults = {}
    this.defaultPlugin = null
    this.config = {}

    this.addCoreExtensions()
  }

  get pluginNames () {
    return pluck('name', this.plugins)
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
    if (!isDirectory(directory)) {
      if (options.required) {
        throw new Error(`Error: couldn't load plugin (not a directory): ${directory}`)
      } else {
        return
      }
    }
    const { brand } = this
    const plugin = loadPluginFromDirectory(resolve(directory), {
      brand,
      hidden: options['hidden'],
      name: options['name'],
      commandFilePattern: options['commandFilePattern'],
      extensionFilePattern: options['extensionFilePattern']
    })

    this.plugins = append(plugin, this.plugins)
    forEach(extension => this.addExtension(extension.name, extension.setup), plugin.extensions)
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
    const plugin = this.load(directory, Object.assign({ required: true }, options))
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
   * Find the command for this commandPath.
   *
   * @param {string[]} commandPath    The command to find.
   * @returns {{}}                    An object containing a Plugin and Command if found, otherwise null
   */
  findCommand (commandPath) {
    let targetPlugin, targetCommand, rest

    // start with defaultPlugin, then move on to the others
    const otherPlugins = this.plugins.filter(p => p !== this.defaultPlugin)
    const plugins = [this.defaultPlugin, ...otherPlugins].filter(p => !isNil(p))

    targetPlugin = find(plugin => {
      if (isNil(plugin) || isNilOrEmpty(plugin.commands)) return { command: null, args: [] }
      if (!commandPath) {
        commandPath = []
      }

      // track the rest of the commandPath as we traverse
      rest = commandPath.slice() // dup

      // traverse through the command path, retrieving aliases along the way
      const finalCommandPath = reduce((prevPath, currName) => {
        // find a command that fits the previous path + currentName, which can be an alias
        const cmd = find(
          command => {
            return (
              equals(command.commandPath.slice(0, -1), prevPath) &&
              [command.name].concat(command.aliases).includes(currName)
            )
          },
          // sorted shortest path to longest
          sort((a, b) => a.commandPath.length - b.commandPath.length, plugin.commands)
        )

        if (cmd) {
          rest.shift() // remove the current item
          return cmd.commandPath
        } else {
          return prevPath
        }
      }, [])(commandPath)

      if (finalCommandPath.length === 0) {
        targetCommand = find(command => equals(command.commandPath, [plugin.name]), plugin.commands)
      } else {
        targetCommand = find(
          command => equals(command.commandPath, finalCommandPath),
          plugin.commands
        )
      }

      // Did we find the targetCommand?
      return Boolean(targetCommand)
    }, plugins)

    return { plugin: targetPlugin, command: targetCommand, array: rest }
  }
}

module.exports = Runtime
