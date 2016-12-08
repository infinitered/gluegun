const nunjucks = require('nunjucks')
const jetpack = require('fs-jetpack')
const { replace, pipe } = require('ramda')
const _ = require('lodash')
const { isBlank } = require('../utils/string-utils')

/**
 * The default configuration used by nunjucks.
 */
const DEFAULT_CONFIG = {
  autoescape: false,
  tags: {
  }
}

/**
 * Builds the code generation feature.
 *
 * @param  {Plugin}     plugin  The plugin that triggered.
 * @param  {Command}    command The current command that is running.
 * @param  {RunContext} context The running context.
 * @return {Function}           A function to attach to the context.
 */
function attach (plugin, command, context) {
  /**
   * Generates a file from a template.
   *
   * @param  {{}} opts Generation options.
   * @return {string}  The generated string.
   */
  async function generate (opts = {}) {
    // required
    const template = opts.template

    // optional
    const target = opts.target
    const props = opts.props || {}

    // grab some features
    const { print } = context
    const { stepComplete, colors } = print

    // grab the path to the plugin
    const pluginTemplatesLoader = new nunjucks.FileSystemLoader(`${plugin.directory}/templates`)

    // create a nunjucks environment
    const env = new nunjucks.Environment(pluginTemplatesLoader, DEFAULT_CONFIG)

    // add some goodies to the environment so templates can read them
    env.addGlobal('config', context.config)
    env.addGlobal('parameters', context.parameters)
    env.addGlobal('props', props)

    // add some pre-baked filters -- thanks Lodash!
    env.addFilter('identity', x => x)
    env.addFilter('camelCase', _.camelCase)
    env.addFilter('kebabCase', _.kebabCase)
    env.addFilter('snakeCase', _.snakeCase)
    env.addFilter('upperCase', _.upperCase)
    env.addFilter('lowerCase', _.lowerCase)
    env.addFilter('startCase', _.startCase)
    env.addFilter('upperFirst', _.upperFirst)
    env.addFilter('lowerFirst', _.lowerFirst)
    env.addFilter('classCase', pipe(_.camelCase, _.upperFirst))
    env.addFilter('pad', _.pad)
    env.addFilter('padStart', _.padStart)
    env.addFilter('padEnd', _.padEnd)
    env.addFilter('trim', _.trim)
    env.addFilter('trimStart', _.trimStart)
    env.addFilter('trimEnd', _.trimEnd)
    env.addFilter('repeat', _.repeat)

    // render the template
    const content = env.render(template)

    // save it to the file system
    if (!isBlank(target)) {
      // prep the destination directory
      const dir = replace(/$(\/)*/g, '', target)
      const dest = `${jetpack.cwd()}/${dir}`

      const colorTemplate = colors.muted(`from ${template}`)
      stepComplete(`generated`, `${target} ${colorTemplate}`)
      jetpack.write(dest, content)
    }

    // send back the rendered string
    return content
  }

  return { generate }
}

module.exports = attach
