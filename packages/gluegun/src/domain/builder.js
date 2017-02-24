const autobind = require('autobind-decorator')
const Runtime = require('./runtime')
const { dissoc, pipe, tryCatch, always } = require('ramda')
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
    const attemptConfigLoad = !isBlank(this.configFile) &&
      isFile(this.configFile)

    // load the config if we got it
    if (attemptConfigLoad) {
      // load the config
      const config = pipe(jetpack.read, tryCatch(toml.parse, always({})))(
        this.configFile
      )

      // extract the defaults
      runtime.defaults = config.defaults

      // set config to be the file minutes defaults
      runtime.config = dissoc('defaults', config)
    }

    // set the rest of the properties
    runtime.events = this.events
    runtime.commandNameToken = this.commandNameToken
    runtime.commandDescriptionToken = this.commandDescriptionToken
    runtime.commandHiddenToken = this.commandHiddenToken
    runtime.commandAliasToken = this.commandAliasToken
    runtime.extensionNameToken = this.extensionNameToken

    // the plugins get loaded last
    this.loads.forEach(entry => {
      switch (entry.type) {
        case 'loadDefault':
          runtime.loadDefault(entry.value, entry.options)
          break
        case 'load':
          runtime.load(entry.value, entry.options)
          break
        case 'loadAll':
          runtime.loadAll(entry.value, entry.options)
          break
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
   * @param  {string}  value   The plugin directory.
   * @param  {Object}  options Additional loading options.
   * @return {Builder}         self.
   */
  load (value, options = {}) {
    this.loads.push({ type: 'load', value, options })
    return this
  }

  /**
   * Add a default plugin to the list.
   *
   * @param  {string}  value   The default plugin directory.
   * @param  {Object}  options Additional loading options.
   * @return {Builder}         self.
   */
  loadDefault (value, options = {}) {
    this.loads.push({ type: 'loadDefault', value, options })
    return this
  }

  /**
   * Add a plugin group to the list.
   *
   * @param  {string}  value   The directory with sub-directories.
   * @param  {Object}  options Additional loading options.
   * @return {Builder}         self.
   */
  loadAll (value, options = {}) {
    this.loads.push({ type: 'loadAll', value, options })
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
      case 'commandHidden':
        this.commandHiddenToken = value
        break
      case 'commandAlias':
        this.commandAliasToken = value
        break
      case 'extensionName':
        this.extensionNameToken = value
        break
      default:
        throw new Error(
          'Unrecognized token type.  Must be commandName, commandDescription, or extensionName'
        )
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
