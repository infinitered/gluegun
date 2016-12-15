const autobind = require('autobind-decorator')
const Runtime = require('./runtime')
const { pipe, tryCatch, always, propOr } = require('ramda')
const { isBlank } = require('../utils/string-utils')
const { isFile } = require('../utils/filesystem-utils')
const jetpack = require('fs-jetpack')
const toml = require('toml')

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

    // should we try to load the config?
    const attemptConfigLoad = !isBlank(this.configFile) && isFile(this.configFile)

    // load the config if we got it
    if (attemptConfigLoad) {
      runtime.defaults = pipe(
        jetpack.read,
        tryCatch(toml.parse, always({})),
        propOr({}, 'defaults')
        )(this.configFile)
    }

    // set the rest of the properties
    runtime.events = this.events
    runtime.commandNameToken = this.commandNameToken
    runtime.commandDescriptionToken = this.commandDescriptionToken
    runtime.extensionNameToken = this.extensionNameToken

    // the plugins get loaded last
    this.loads.forEach(entry => {
      switch (entry.type) {
        case 'loadDefault': runtime.loadDefault(entry.value); break
        case 'load': runtime.load(entry.value); break
        case 'loadAll': runtime.loadAll(entry.value, entry.matching); break
      }
    })

    return runtime
  }

  /**
   * Sets the config file.
   *
   * @param {string} configFile A path to a TOML file to load configs.
   */
  configFile (configFile) {
    this.configFile = configFile

    return this
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
   * @matching {string} An optional jetpack glob matching to match.
   * @return {Builder} self.
   */
  loadAll (value, matching) {
    this.loads.push({ type: 'loadAll', value, matching })
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
