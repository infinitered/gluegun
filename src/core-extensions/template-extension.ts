import * as ejs from 'ejs'
import { forEach, keys, replace } from 'ramda'
import { Options } from '../domain/options'
import { filesystem } from '../toolbox/filesystem-tools'
import { strings } from '../toolbox/string-tools'
import { GluegunToolbox } from '../domain/toolbox'

export interface GluegunTemplate {
  generate(options: GluegunTemplateGenerateOptions): Promise<string>
}

export interface GluegunTemplateGenerateOptions {
  /**
   * Path to the EJS template relative from the plugin's `template` directory.
   */
  template: string
  /**
   * Path to create the file relative from the user's working directory.
   */
  target?: string
  /**
   * Additional props to provide to the EJS template.
   */
  props?: { [name: string]: any }
  /**
   * An absolute path of where to find the templates (if not default).
   */
  directory?: string
}

/**
 * Builds the code generation feature.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: GluegunToolbox): void {
  const { plugin } = toolbox

  /**
   * Generates a file from a template.
   *
   * @param opts Generation options.
   * @return The generated string.
   */
  async function generate(opts: Options = {}): Promise<string> {
    // required
    const template = opts.template

    // optional
    const target = opts.target
    const props = opts.props || {}

    // add some goodies to the environment so templates can read them
    const data = {
      config: toolbox && toolbox.config,
      parameters: toolbox && toolbox.parameters,
      props,
    }

    // add our string tools to the filters available.
    forEach(x => {
      data[x] = strings[x]
    }, keys(strings))

    // pick a base directory for templates
    const directory = opts.directory ? opts.directory : `${plugin && plugin.directory}/templates`

    const pathToTemplate = `${directory}/${template}`

    // bomb if the template doesn't exist
    if (!filesystem.isFile(pathToTemplate)) {
      throw new Error(`template not found ${pathToTemplate}`)
    }

    // read the template
    const templateContent = filesystem.read(pathToTemplate)

    // render the template
    const content = ejs.render(templateContent, data)

    // save it to the file system
    if (!strings.isBlank(target)) {
      // prep the destination directory
      const dir = replace(/$(\/)*/g, '', target)
      const dest = filesystem.path(dir)

      filesystem.write(dest, content)
    }

    // send back the rendered string
    return content
  }

  toolbox.template = { generate }
}
