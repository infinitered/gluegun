// @flow
import autobind from 'autobind-decorator'
import Command from './command'

/**
 * The plugin's loading stage.
 *
 * none = the plugin has not been loaded
 * ready = we're ready to go
 * error = something horrible has happened
 */
export type PluginLoadState = 'none' | 'ready' | 'error'

/**
 * The error state.
 *
 * none          = no problems
 * missingdir    = can't find the plugin directory
 * missingconfig = can't find the config file
 * badconfig     = the config file is invalid
 */
export type PluginErrorState = 'none' | 'missingdir' | 'missingconfig' | 'badconfig'

/**
 * Extends the environment with new commands.
 */
@autobind
class Plugin {

  /**
   * The namespace used as a prefix to the commands.
   */
  namespace: ?string

  /**
   * The stage of loading.
   */
  loadState: PluginLoadState = 'none'

  /**
   * The error state
   */
  errorState: PluginErrorState = 'none'

  /**
   * Default plugin configuration.
   */
  config: Object = {}

  /**
   * The location of the plugin on the file system
   */
  directory: ?string

  /**
   * The error message if any.
   */
  errorMessage: ?string

  /**
   * A list of commands.
   */
  commands: Command[] = []

}

export default Plugin
