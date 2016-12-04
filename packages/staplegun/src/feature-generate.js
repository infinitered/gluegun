import nunjucks from 'nunjucks'
import Plugin from './plugin'
import Command from './command'
import RunContext from './run-context'
import jetpack from 'fs-jetpack'
import { replace, pipe } from 'ramda'
import _ from 'lodash'

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
export default (plugin: Plugin, command: Command, context: RunContext) => {
  /**
   * Generates a file from a template.
   *
   * @param  {string} template    The relative path of the template to use.
   * @param  {string} destination The path to the file to make (stars with a $directory key)
   * @param  {{}}                 props A bag of extra properties to use for template generation
   * @return {void}
   */
  function generate (template: string, destination: string, props: any = {}): void {
    // grab the path to the plugin
    const pluginTemplatesLoader = new nunjucks.FileSystemLoader(plugin.directory)

    // create a nunjucks environment
    const env = new nunjucks.Environment(pluginTemplatesLoader, DEFAULT_CONFIG)

    // add some goodies to the environment so templates can read them
    env.addGlobal('config', context.config)
    env.addGlobal('arguments', context.arguments)
    env.addGlobal('options', context.options)
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

    // prep the destination directory
    const dir = replace(/$(\/)*/g, '', destination)
    const dest = `${jetpack.cwd()}/${dir}`

    // render the template
    const content = env.render(template)

    // save it to the file system
    jetpack.write(dest, content)

    return content
  }

  return generate
}
