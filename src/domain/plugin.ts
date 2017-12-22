import Command from './command'
import Extension from './extension'
import Options from './options'

/**
 * Extends the environment with new commands.
 */
class Plugin {
  public name?: string
  public description?: string
  public defaults: Options
  public directory?: string
  public hidden: boolean
  public commands: Command[]
  public extensions: Extension[]

  constructor () {
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

export default Plugin
