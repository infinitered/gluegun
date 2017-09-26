/**
 * A command is user-callable function that runs stuff.
 */
class Command {
  constructor () {
    this.name = null
    this.description = null
    this.file = null
    this.run = null
    this.hidden = false
  }
}

module.exports = Command
