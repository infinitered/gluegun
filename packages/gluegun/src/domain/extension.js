/**
 * An extension will add functionality to the context that each command will receive.
 */
class Extension {
  constructor () {
    this.name = null
    this.description = null
    this.file = null
    this.setup = null
  }
}

module.exports = Extension
