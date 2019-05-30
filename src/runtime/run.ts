import { EmptyToolbox, GluegunToolbox } from '../domain/toolbox'
import { createParams, parseParams } from '../toolbox/parameter-tools'
import { Runtime } from './runtime'
import { findCommand } from './runtime-find-command'
import { Options } from '../domain/options'
import { loadConfig } from '../loaders/config-loader'

/**
 * Runs a command.
 *
 * @param rawCommand Command string or array of strings.
 * @param extraOptions Additional options use to execute a command.
 * @return The Toolbox object indicating what happened.
 */
export async function run(
  this: Runtime,
  rawCommand?: string | string[],
  extraOptions: Options = {},
): Promise<GluegunToolbox> {
  // use provided rawCommand or process arguments if none given
  rawCommand = rawCommand || process.argv

  // prepare the run toolbox
  let toolbox = new EmptyToolbox()

  // attach the runtime
  toolbox.runtime = this

  // parse the parameters initially
  toolbox.parameters = parseParams(rawCommand, extraOptions)

  // find the command, and parse out aliases
  const { command, array } = findCommand(this, toolbox.parameters)

  // rebuild the parameters, now that we know the plugin and command
  toolbox.parameters = createParams({
    plugin: command.plugin && command.plugin.name,
    command: command.name,
    array,
    options: toolbox.parameters.options,
    raw: rawCommand,
    argv: process.argv,
  })

  // set a few properties
  toolbox.plugin = command.plugin || this.defaultPlugin
  toolbox.command = command
  toolbox.pluginName = toolbox.plugin && toolbox.plugin.name
  toolbox.commandName = command.name

  // setup the config
  toolbox.config = { ...this.config }
  if (toolbox.pluginName) {
    toolbox.config[toolbox.pluginName] = {
      ...toolbox.plugin.defaults,
      ...((this.defaults && this.defaults[toolbox.pluginName]) || {}),
    }
  }

  // expose cosmiconfig
  toolbox.config.loadConfig = loadConfig

  // allow extensions to attach themselves to the toolbox
  const extensionSetupPromises = this.extensions.map(extension => {
    const setupResult = extension.setup(toolbox)
    return setupResult === void 0 ? Promise.resolve(null) : Promise.resolve(setupResult)
  })
  await Promise.all(extensionSetupPromises)

  // check for updates
  if (this.checkUpdate) {
    const updateAvailable = await toolbox.meta.checkForUpdate()
    if (updateAvailable) {
      console.log(`Update available: ${updateAvailable}`)
    }
  }

  // kick it off
  if (toolbox.command.run) {
    // run the command
    toolbox.result = await toolbox.command.run(toolbox as GluegunToolbox)
  }

  // recast it
  const finalToolbox = toolbox as GluegunToolbox

  return finalToolbox
}
