/**
 * Extends the environment with new commands.
 */
class Plugin {
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

module.exports = Plugin
