import { Command } from './command'
import { Extension } from './extension'
import { Options } from './options'

/**
 * Extends the environment with new commands.
 */
export class Plugin {
  /** The name of the plugin. */
  public name?: string
  /** A description used in the cli. */
  public description?: string
  /** Default configuration values. */
  public defaults: Options
  /** The directory this plugin lives in. */
  public directory?: string
  /** Should we hide this command from the cli? */
  public hidden: boolean
  /** The commands in this plugin. */
  public commands: Command[]
  /** The extensions in this plugin. */
  public extensions: Extension[]

  constructor() {
    this.name = null
    this.description = null
    this.defaults = {}
    this.directory = null
    this.hidden = false
    /**
     * A list of commands.
     */
    this.commands = []
    this.extensions = []
  }
}
