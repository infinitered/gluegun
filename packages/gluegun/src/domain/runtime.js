const autobind = require('autobind-decorator')
const { clone, when, equals, always, join, split, trim, pipe, replace, find, append, forEach, isNil } = require('ramda')
const { findByProp, startsWith } = require('ramdasauce')
const { isBlank } = require('../utils/string-utils')
const RunContext = require('./run-context')

// core extensions
const addTemplateExtension = require('../extensions/template-extension')
const addPrintExtension = require('../extensions/print-extension')
const addFilesystemExtension = require('../extensions/filesystem-extension')
const addSystemExtension = require('../extensions/system-extension')

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
* @param  {string}     namespace The namespace to run.
* @param  {string}     full      The complete list of arguments to target the right command.
* @param  {{}}         options   Additional options to pass to the command
* @return {RunContext}           The RunContext object indicating what happened.
*/
async function run (namespace, full = '', options = {}) {
  // prepare the run context
  const context = new RunContext()

  // setup the context parameters that we know
  context.parameters = {
    namespace,
    options,
    full
  }

  // find the plugin
  const plugin = this.findPlugin(namespace)
  if (!plugin) {
    return context
  }

  // setup the config
  context.config = {}
  context.config[plugin.namespace] = clone(plugin.defaults)

  // find the command
  const command = this.findCommand(plugin, full)

  if (command) {
    // setup the rest of the parameters
    const subArgs = extractSubArguments(full, trim(command.name))
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
        console.log(e.message)
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
  constructor () {
    this.run = run // awkward because node.js doesn't support async-based class functions yet.
    this.plugins = []
    this.directories = {}
    this.extensions = []
    this.addCoreExtensions()
  }

  /**
   * Adds the core extensions.  These provide the basic features
   * available in gluegun, but follow the exact same method
   * for extending the core as 3rd party extensions do.
   */
  addCoreExtensions () {
    this.addExtension('print', addPrintExtension)
    this.addExtension('template', addTemplateExtension)
    this.addExtension('filesystem', addFilesystemExtension)
    this.addExtension('system', addSystemExtension)
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
   * Adds a plugin.
   */
  addPlugin (plugin) {
    this.plugins = append(plugin, this.plugins)
    return plugin
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
   * Find the plugin for this namespace.
   *
   * @param {string} namespace The namespace to search through.
   * @returns {*}              A Plugin otherwise null.
   */
  findPlugin (namespace) {
    return findByProp('namespace', namespace || '', this.plugins)
  }

  /**
   * Find the command for this namespace & command.
   *
   * @param {Plugin} plugin        The plugin in which the command lives.
   * @param {string} fullArguments The command arguments to parse.
   * @returns {*}                  A Command otherwise null.
   */
  findCommand (plugin, fullArguments) {
    if (isNil(plugin) || isBlank(fullArguments)) return null
    if (plugin.commands.length === 0) return null

    return find(
      (command) => startsWith(command.name, fullArguments)
      , plugin.commands
      )
  }

}

module.exports = autobind(Runtime)
