const Runtime = require('./runtime')
const { dissoc } = require('ramda')
const { loadConfig } = require('../loaders/config-loader')

/**
 * Provides a cleaner way to build a runtime.
 *
 * @class Builder
 */
class Builder {
  constructor () {
    this.loadPlugins = [] // the plugins
    this.create = this.create.bind(this)
    this.brand = this.brand.bind(this)
    this.src = this.src.bind(this)
    this.plugin = this.plugin.bind(this)
    this.plugins = this.plugins.bind(this)
  }

  /**
   * Makes the runtime.
   *
   * @return {Runtime} The runtime we're building
   */
  create () {
    const runtime = new Runtime(this.brand)

    const defaultPlugin = this.loadPlugins.find(p => p.type === 'default')

    const config = defaultPlugin ? loadConfig(this.brand, defaultPlugin.value) : {}

    // extract the defaults
    runtime.defaults = config.defaults

    // set config to be the file minutes defaults
    runtime.config = dissoc('defaults', config)

    // the plugins get loaded last
    this.loadPlugins.forEach(entry => {
      switch (entry.type) {
        case 'default':
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
   * Specifies where the default commands and extensions live.
   *
   * @param  {string}  value   The default plugin directory.
   * @param  {Object}  options Additional loading options.
   * @return {Builder}         self.
   */
  src (value, options = {}) {
    options.name = options.name || this.brand
    this.loadPlugins.push({ type: 'default', value, options })
    return this
  }

  /**
   * Add a plugin to the list.
   *
   * @param  {string}  value   The plugin directory.
   * @param  {Object}  options Additional loading options.
   * @return {Builder}         self.
   */
  plugin (value, options = {}) {
    this.loadPlugins.push({ type: 'load', value, options })
    return this
  }

  /**
   * Add a plugin group to the list.
   *
   * @param  {string}  value   The directory with sub-directories.
   * @param  {Object}  options Additional loading options.
   * @return {Builder}         self.
   */
  plugins (value, options = {}) {
    this.loadPlugins.push({ type: 'loadAll', value, options })
    return this
  }
}

/**
 * Export it as a factory function.
 */
module.exports = function build () {
  return new Builder()
}
