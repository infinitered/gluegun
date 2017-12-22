import { clone, isNil, merge } from 'ramda'
import RunContext from '../domain/run-context'
import { createParams, parseParams } from '../toolbox/parameter-tools'
import Runtime from './runtime'
import { findCommand } from './runtime-find-command'

/**
 * Runs a command.
 *
 * @param  {string} rawCommand Command string.
 * @param  {{}} extraOptions Additional options use to execute a command.
 * @return {RunContext} The RunContext object indicating what happened.
 */
export async function run (this: Runtime, rawCommand: string | object, extraOptions = {}): Promise<RunContext> {
  // use provided rawCommand or process arguments if none given
  rawCommand = rawCommand || process.argv

  // prepare the run context
  const context = new RunContext()

  // attach the runtime
  context.runtime = this

  // parse the parameters initially
  context.parameters = parseParams(rawCommand, extraOptions)

  // find the plugin and command, and parse out aliases
  const { plugin, command, array } = findCommand(this, context.parameters)

  // jet if we have no plugin or command
  if (isNil(plugin) || isNil(command)) {
    return context
  }

  // rebuild the parameters, now that we know the plugin and command
  context.parameters = createParams({
    plugin: plugin.name,
    command: command.name,
    array,
    options: context.parameters.options,
    raw: rawCommand,
    argv: process.argv,
  })

  // set a few properties
  context.plugin = plugin
  context.command = command
  context.pluginName = plugin.name
  context.commandName = command.name

  // setup the config
  context.config = clone(this.config)
  context.config[context.plugin.name] = merge(
    context.plugin.defaults,
    (this.defaults && this.defaults[context.plugin.name]) || {},
  )

  // kick it off
  if (context.command.run) {
    // allow extensions to attach themselves to the context
    this.extensions.forEach(extension => extension.setup(context))

    // run the command
    context.result = await context.command.run(context)
  }

  return context
}
