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
export type PluginError = 'Missing' | 'Invalid' | 'Initialize'

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
 * A filter is a function that can be attached to a template.
 */
export type Filter = {
  name: string,     // the name as it will appear in the template system
  plugin: Plugin,   // the plugin from whence this command came
}

/**
 * A command is a target of an action.  It comes out of a plugin and does stuff.
 */
export type Script = {
  type: string,     // the action type which will trigger this command
  plugin: Plugin,   // the plugin from whence this command came
  config: {},       // the default configuration for this plugin
  handler: Function // the function which will run
}

/**
 * Holds the user-configurable things.
 */
export type Registry = {
  invalidPlugins: Array<Plugin>, // holds plugins that were unable to load
  plugins: Array<Plugin>,        // holds plugins that were able to load
  scripts: Array<Script>,        // holds scripts that were registered in plugins
  filters: Array<Filter>,        // holds filters that were registered in plugins

  load: Function // loads a plugin from a path on the filesystem
}

