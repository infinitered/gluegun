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
    this.commandPath = null
    this.alias = null
  }

  get aliases () {
    if (this.alias === null) { return [] }
    return Array.isArray(this.alias) ? this.alias : [ this.alias ]
  }

  hasAlias () {
    return this.alias !== null && this.alias.length > 0
  }
}

module.exports = Command
