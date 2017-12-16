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
    this.dashed = false
  }

  get aliases () {
    if (this.alias === null) {
      return []
    }
    return Array.isArray(this.alias) ? this.alias : [this.alias]
  }

  hasAlias () {
    return this.alias !== null && this.alias.length > 0
  }

  /**
   * Checks if a given alias matches with this command's aliases, including name.
   * Can take a list of aliases too and check them all.
   *
   * @param {string|string[]} alias
   */
  matchesAlias (alias) {
    const aliases = Array.isArray(alias) ? alias : [alias]
    return aliases.find(a => this.name === a || this.aliases.includes(a))
  }
}

module.exports = Command
