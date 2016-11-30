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

// The action is the user's request to run a script.
export type Action = {

  /**
   * The name of the script we're attempting to target.
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
 * A plugin extends the environment by providing scripts, filters, and commands.
 */
export type Plugin = {
  status: PluginStatus,   // the loading status
  path: string,           // the absolute path on the file system
  config: {},             // the default configuration
  initializer: ?Function, // the initializer function to call when setting up the plugin
  error: ?PluginError,    // should there be an error, this is it
  errorMessage: ?string   // a friendly error should there be one
}

/**
 * A filter is a function that can be attached to a template which
 * provides a way to customize the output when templating.  These are
 * only made available to the Nunjucks templating engine.
 */
export type Filter = {
  name: string,     // the name as it will appear in the template system
  plugin: Plugin,   // the plugin from whence this filter came
  fn: Function      // the filter that runs
}

/**
 * A script is a target of an action.  It comes out of a plugin and runs commands.
 */
export type Script = {
  name: string,     // the name of the script (as it appears on the config (unique within the plugin)
  plugin: Plugin,   // the birthplace plugin
  config: {},       // the default configuration for this plugin
  handler: Function // the function which will run
}

/**
 * A command the heart of this system.  They are user-defined functions that provide the core functionality.
 */
export type Command = {
  name: string,      // the name of the command (it'll be called with this name)
  plugin: Plugin,    // the plugin that introduced this command
  fn: Function       // the command that runs
}

/**
 * Registry configuration.
 */
export type RegistryConfig = {
  namespace: string, // the unique namespace of this registry
  path: string       // the path to the TOML config file
}

/**
 * Holds the user-configurable things.
 */
export type Registry = {
  namespace: string,             // the unique namespace of this registry
  invalidPlugins: Array<Plugin>, // holds plugins that were unable to load
  plugins: Array<Plugin>,        // holds plugins that were able to load
  scripts: Array<Script>,        // holds scripts that were registered in plugins
  filters: Array<Filter>,        // holds filters that were registered in plugins
  commands: Array<Command>,      // holds the commands that can get called

  useFromFile: Function, // loads a plugin from a path on the filesystem
  use: Function          // loads a plugin from a Plugin
}

/**
 * The top-level environment that will run our actions through.
 */
export type Runtime = {
  workingDir: ?string,         // the path that is our root
  configPath: ?string,         // the full path to the TOML used
  config: {},                  // the configuration
  registries: Array<Registry>, // a list of registries providing functionality

  run: Function, // runs an action
  print: Function, // plugins can call this to print output to the user
}
