const nunjucks = require('nunjucks')
const jetpack = require('fs-jetpack')
const { replace, map, keys } = require('ramda')
const stringUtils = require('../utils/string-utils')

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
    const { colors } = print

    // grab the path to the plugin
    const pluginTemplatesLoader = new nunjucks.FileSystemLoader(`${plugin.directory}/templates`)

    // create a nunjucks environment
    const env = new nunjucks.Environment(pluginTemplatesLoader, DEFAULT_CONFIG)

    // add some goodies to the environment so templates can read them
    env.addGlobal('config', context.config)
    env.addGlobal('parameters', context.parameters)
    env.addGlobal('props', props)

    // add our string utils to the filters available.
    map(
      x => env.addFilter(x, stringUtils[x]),
      keys(stringUtils)
    )

    // render the template
    const content = env.render(template)

    // save it to the file system
    if (!stringUtils.isBlank(target)) {
      // prep the destination directory
      const dir = replace(/$(\/)*/g, '', target)
      const dest = `${jetpack.cwd()}/${dir}`

      const generated = colors.cyan(`generated`)
      const colorTemplate = colors.muted(`from ${template}`)
      print.info(`${print.checkmark} ${generated} ${target} ${colorTemplate}`)
      jetpack.write(dest, content)
    }

    // send back the rendered string
    return content
  }

  return { generate }
}

module.exports = attach
