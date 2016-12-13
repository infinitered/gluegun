const autobind = require('autobind-decorator')
const Runtime = require('./runtime')

/**
 * Provides a cleaner way to build a runtime.
 *
 * @class Builder
 */
class Builder {

  constructor () {
    this.loads = [] // the plugins
    this.events = {} // the events
  }

  /**
   * Makes the runtime.
   *
   * @return {Runtime} The runtime we're building
   */
  createRuntime () {
    const runtime = new Runtime(this.brand)

    // the plugins
    this.loads.forEach(entry => {
      switch (entry.type) {
        case 'loadDefault': runtime.loadDefault(entry.value); break
        case 'load': runtime.load(entry.value); break
        case 'loadAll': runtime.loadAll(entry.value); break
      }
    })

    // set the rest of the properties
    runtime.events = this.events
    runtime.commandNameToken = this.commandNameToken || runtime.commandNameToken
    runtime.commandDescriptionToken = this.commandDescriptionToken || runtime.commandDescriptionToken
    runtime.extensionNameToken = this.extensionNameToken || runtime.extensionNameToken

    return runtime
  }

  /**
   * Set the brand.
   *
   * @value {string} The brand.
   * @return {Builder} self.
   */
  brand (value) {
    this.brand = value
    return this
  }

  /**
   * Add a plugin to the list.
   *
   * @value {string} The plugin directory.
   * @return {Builder} self.
   */
  load (value) {
    this.loads.push({ type: 'load', value })
    return this
  }

  /**
   * Add a default plugin to the list.
   *
   * @value {string} The default plugin directory.
   * @return {Builder} self.
   */
  loadDefault (value) {
    this.loads.push({ type: 'loadDefault', value })
    return this
  }

  /**
   * Add a plugin group to the list.
   *
   * @value {string} The directory with sub-directories.
   * @return {Builder} self.
   */
  loadAll (value) {
    this.loads.push({ type: 'loadAll', value })
    return this
  }

  /**
   * Registers an event.
   *
   * @param  {string}   event    The name of the event.
   * @param  {function} callback The function to call when the even is triggered.
   * @return {Builder}           self.
   */
  on (event, callback) {
    this.events[event] = this.events[event] || []
    this.events[event].push(callback)
    return this
  }

  /**
   * Sets one of the tokens used when parsing commands & extensions.
   *
   * @param  {string} type  The token type: commandName, commandDescription, extensionName.
   * @param  {string} value The new token name without the '@'
   * @return {Builder}      self.
   */
  token (type, value) {
    switch (type) {
      case 'commandName':
        this.commandNameToken = value
        break
      case 'commandDescription':
        this.commandDescriptionToken = value
        break
      case 'extensionName':
        this.extensionNameToken = value
        break
      default:
        throw new Error('Unrecognized token type.  Must be commandName, commandDescription, or extensionName')
    }

    return this
  }

}

/**
 * Export it as a factory function.
 */
module.exports = function build () {
  return new (autobind(Builder))()
}
