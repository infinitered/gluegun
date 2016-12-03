// @flow
import autobind from 'autobind-decorator'
import Command from './command'
import { isNotFile, isNotDirectory, isBlank } from './utils'
import jetpack from 'fs-jetpack'
import { map } from 'ramda'

const PACKAGE_FILENAME = 'package.json'
const ROOT_KEY = 'staplegun'

/**
 * The plugin's loading stage.
 *
 * none  = the plugin has not been loaded
 * ok    = we're ready to go
 * error = something horrible has happened
 */
export type PluginLoadState = 'none' | 'ok' | 'error'

/**
 * The error state.
 *
 * none           = no problems
 * input          = invalid directory input
 * missingdir     = can't find the plugin directory
 * missingpackage = can't find package.json
 * badpackage     = the package.json is invalid
 * namespace      = the package.json is missing namespace
 */
export type PluginErrorState =
  'none' | 'input' | 'missingdir' | 'missingpackage' |
  'badpackage' | 'namespace'

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
  defaults: Object = {}

  /**
   * The absolute path of the plugin on the file system
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

  reset () {
    this.commands = []
    this.defaults = {}
    this.loadState = 'none'
    this.errorState = 'none'
    this.namespace = null
    this.errorMessage = null
  }

  /**
   * Loads a plugin from a directory.
   */
  loadFromDirectory (directory: string) {
    this.reset()

    // sanity check
    if (isBlank(directory)) {
      this.loadState = 'error'
      this.errorState = 'input'
      return
    }

    // directory check
    if (isNotDirectory(directory)) {
      this.loadState = 'error'
      this.errorState = 'missingdir'
      return
    }

    this.directory = directory

    // check for package.json
    const packagePath = `${directory}/${PACKAGE_FILENAME}`
    if (isNotFile(packagePath)) {
      this.loadState = 'error'
      this.errorState = 'missingpackage'
      return
    }

    // load the toml file
    try {
      // read the file
      const pkg = jetpack.read(packagePath, 'json')
      const root = pkg[ROOT_KEY]
      if (!root) throw new Error('missing root key')

      // validate the namespace
      if (isBlank(root.namespace)) {
        this.loadState = 'error'
        this.errorState = 'namespace'
        return
      }

      // read the defaults & commands
      this.namespace = root.namespace
      this.defaults = root.defaults || {}
      this.commands = map(this.loadCommandFromConfig, root.commands || [])

      // we are good!
      this.loadState = 'ok'
      this.errorState = 'none'
      this.errorMessage = null
    } catch (e) {
      this.loadState = 'error'
      this.errorState = 'badpackage'
    }
  }

  /**
   * Loads a command based on the entry in the package.json
   */
  loadCommandFromConfig (config: any = {}) {
    const command = new Command()
    const { name, file, functionName, description } = config
    command.name = name
    command.description = description
    if (this.directory) {
      const fullpath = `${this.directory}/${file}`
      command.loadFromFile(fullpath, functionName)
    }
    return command
  }

}

export default Plugin
