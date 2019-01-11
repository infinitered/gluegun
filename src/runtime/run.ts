import { isNil } from '../toolbox/utils'
import { Toolbox } from '../domain/toolbox'
import { createParams, parseParams } from '../toolbox/parameter-tools'
import { Runtime } from './runtime'
import { findCommand } from './runtime-find-command'
import { Options } from '../domain/options'

/**
 * Runs a command.
 *
 * @param rawCommand Command string or array of strings.
 * @param extraOptions Additional options use to execute a command.
 * @return The Toolbox object indicating what happened.
 */
export async function run(this: Runtime, rawCommand?: string | string[], extraOptions: Options = {}): Promise<Toolbox> {
  // use provided rawCommand or process arguments if none given
  rawCommand = rawCommand || process.argv

  // prepare the run toolbox
  const toolbox = new Toolbox()

  // attach the runtime
  toolbox.runtime = this

  // parse the parameters initially
  toolbox.parameters = parseParams(rawCommand, extraOptions)

  // find the command, and parse out aliases
  const { command, array } = findCommand(this, toolbox.parameters)

  // jet if we have no command
  if (isNil(command)) return toolbox

  // rebuild the parameters, now that we know the plugin and command
  toolbox.parameters = createParams({
    plugin: command.plugin.name,
    command: command.name,
    array,
    options: toolbox.parameters.options,
    raw: rawCommand,
    argv: process.argv,
  })

  // set a few properties
  toolbox.plugin = command.plugin || this.defaultPlugin
  toolbox.command = command
  toolbox.pluginName = toolbox.plugin.name
  toolbox.commandName = command.name

  // setup the config
  toolbox.config = { ...this.config }
  toolbox.config[toolbox.plugin.name] = {
    ...toolbox.plugin.defaults,
    ...((this.defaults && this.defaults[toolbox.plugin.name]) || {}),
  }

  // kick it off
  if (toolbox.command.run) {
    // allow extensions to attach themselves to the toolbox
    this.extensions.forEach(extension => extension.setup(toolbox))

    // run the command
    toolbox.result = await toolbox.command.run(toolbox)
  }

  return toolbox
}
