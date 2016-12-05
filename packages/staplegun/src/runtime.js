const autobind = require('autobind-decorator')
const Plugin = require('./plugin')
const { clone, when, equals, always, join, split, trim, pipe, replace, find, append, forEach, isNil } = require('ramda')
const { findByProp, startsWith } = require('ramdasauce')
const { isBlank } = require('./utils')
const RunContext = require('./run-context')
const createGenerateFeature = require('./feature-generate')

const COMMAND_DELIMITER = ' '

/**
 * Strips the command out of the args returns an array of the rest.
 *
 * @param {string} args The full arguments including command.
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
* @param  {string} namespace     The namespace to run.
* @param  {string} fullArguments The complete list of arguments to target the right command.
* @param  {{}}     options       Additional options to pass to the commane
* @return {RunContext}           The RunContext object indicating what happened.
*/
async function run (namespace, fullArguments = '', options = {}) {
  // prepare the run context
  const context = new RunContext()
  context.fullArguments = fullArguments
  context.options = options
  context.directories = clone(this.directories)

  // find the plugin
  const plugin = this.findPlugin(namespace)
  if (!plugin) {
    return context
  }
  context.config = clone(plugin.defaults)


  // find the command
  const command = this.findCommand(plugin, fullArguments)

  if (command) {
    // parse & chop up the arguments
    context.arguments = extractSubArguments(fullArguments, trim(command.name))
    context.stringArguments = join(COMMAND_DELIMITER, context.arguments)

    // kick it off
    if (command.run) {
      // attach features
      context.generate = createGenerateFeature(plugin, command, context)

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
    this.plugins = []
    this.directories = {}
    this.run = run.bind(this)
  }

  /**
   * Adds a plugin.
   */
  addPlugin (plugin) {
    this.plugins = append(plugin, this.plugins)
  }

  /**
   * Loads a plugin from a directory.
   *
   * @param {string} directory The full path to a directory.
   * @returns {Plugin}         The plugin that was just created.  Healthy or not.
   */
  addPluginFromDirectory (directory) {
    const plugin = new Plugin()
    plugin.loadFromDirectory(directory)
    this.addPlugin(plugin)
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

//
// Runtime.run = run

module.exports = autobind(Runtime)
