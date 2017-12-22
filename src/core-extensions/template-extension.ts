import * as ejs from 'ejs'
import * as jetpack from 'fs-jetpack'
import { forEach, keys, replace } from 'ramda'
import Options from '../domain/options'
import { isFile } from '../toolbox/filesystem-tools'
import * as stringTools from '../toolbox/string-tools'

/**
 * Builds the code generation feature.
 *
 * @param  {RunContext} context The running context.
 */
function attach (context) {
  const { plugin } = context

  /**
   * Generates a file from a template.
   *
   * @param  {{}} opts Generation options.
   * @return {string}  The generated string.
   */
  async function generate (opts: Options = {}) {
    // required
    const template = opts.template

    // optional
    const target = opts.target
    const props = opts.props || {}

    // add some goodies to the environment so templates can read them
    const data = {
      config: context && context.config,
      parameters: context && context.parameters,
      props,
    }

    // add our string tools to the filters available.
    forEach(x => {
      data[x] = stringTools[x]
    }, keys(stringTools))

    // pick a base directory for templates
    const directory = opts.directory ? opts.directory : `${plugin && plugin.directory}/templates`

    const pathToTemplate = `${directory}/${template}`

    // bomb if the template doesn't exist
    if (!isFile(pathToTemplate)) {
      throw new Error(`template not found ${pathToTemplate}`)
    }

    // read the template
    const templateContent = jetpack.read(pathToTemplate)

    // render the template
    const content = ejs.render(templateContent, data)

    // save it to the file system
    if (!stringTools.isBlank(target)) {
      // prep the destination directory
      const dir = replace(/$(\/)*/g, '', target)
      const dest = jetpack.path(dir)

      jetpack.write(dest, content)
    }

    // send back the rendered string
    return content
  }

  context.template = { generate }
}

module.exports = attach
