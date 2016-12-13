/**
 * The plugin's loading stage.
 *
 * none  = the plugin has not been loaded
 * ok    = we're ready to go
 * error = something horrible has happened
 */
// export type PluginLoadState = 'none' | 'ok' | 'error'

/**
 * The error state.
 *
 * none           = no problems
 * input          = invalid directory input
 * missingdir     = can't find the plugin directory
 * baddnamespace  = this namespace is not permitted
 */
// export type PluginErrorState =
//   'none' | 'input' | 'missingdir'

/**
 * Extends the environment with new commands.
 */
class Plugin {

  constructor () {
    this.namespace = null
    this.loadState = 'none'
    this.errorState = 'none'
    this.description = null
    this.defaults = {}
    this.directory = null
    this.errorMessage = null
    /**
     * A list of commands.
     */
    this.commands = []
    this.extensions = []
    this.exception = null
  }

}

module.exports = Plugin
