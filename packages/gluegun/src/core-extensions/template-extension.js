const ejs = require('ejs')
const jetpack = require('fs-jetpack')
const { replace, forEach, keys } = require('ramda')
const stringUtils = require('../utils/string-utils')

/**
 * Builds the code generation feature.
 *
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

    // add some goodies to the environment so templates can read them
    const data = {
      config: context.config,
      parameters: context.parameters,
      props: props
    }

    // add our string utils to the filters available.
    forEach(
      x => { data[x] = stringUtils[x] },
      keys(stringUtils)
    )

    // preference given to sporks
    const sporkTemplateContent = jetpack.read(`${jetpack.cwd()}/${context.runtime.brand}/templates/${plugin.namespace}`)
    const templateContent = sporkTemplateContent || jetpack.read(`${plugin.directory}/templates/${template}`)
    // render the template
    const content = ejs.render(templateContent, data)

    // save it to the file system
    if (!stringUtils.isBlank(target)) {
      // prep the destination directory
      const dir = replace(/$(\/)*/g, '', target)
      const dest = `${jetpack.cwd()}/${dir}`

      jetpack.write(dest, content)
    }

    // send back the rendered string
    return content
  }

  return { generate }
}

module.exports = attach
