const autobind = require('autobind-decorator')
const Runtime = require('./runtime')

class Builder {

  constructor () {
    this.runtime = new Runtime('')
  }

  brand (value) {
    this.runtime.brand = value
    return this
  }

  load (value) {
    this.runtime.load(value)
    return this
  }

  loadDefault (value) {
    this.runtime.loadDefault(value)
    return this
  }

  loadAll (value) {
    this.runtime.loadAll(value)
    return this
  }

}

module.exports = function build () {
  return new (autobind(Builder))()
}
