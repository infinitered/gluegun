// @flow

/**
 * A list of extra arguments passed to an action.
 *
 * For example, if file generator plugin might create the file User.js
 * when it sees: ['User'].
 */
export type ActionArguments = Array<string>

/** Flags or options that further qualify options.
 *
 * For example, { overwrite: true }, might be used by a file generator
 * to clobber a file without prompting the user.
 */
export type ActionOptions = { [key: string]: any }

// The action is the user's request to run a command.
export type Action = {

  /**
   * The name of the command we're attempting to target.
   */
  type: string,

  /**
   * Additional arguments a plugin might need.
   */
  arguments: ActionArguments,

  /**
   * A bag of options.
   */
  options: ActionOptions

}

/**
 * The states of plugin loading.
 */
export type PluginStatus = 'Loaded' | 'Initialized' | 'Error'

/**
 * Reasons the plugin didn't load.
 */
export type PluginError = 'Missing' | 'Invalid'

/**
 * A plugin extends the environment by providing commands, filters, and directives.
 */
export type Plugin = {
  status: PluginStatus,   // the loading status
  path: string,           // the absolute path on the file system
  config: {},             // the default configuration
  initializer: ?Function, // the initializer function to call when setting up the plugin
  error: ?PluginError     // should there be an error, this is it
}

/**
 * Holds the plugins.
 */
export type PluginRegistry = {
  plugins: Array<Plugin>
}

