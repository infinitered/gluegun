// @cliDescription Copies some templates from a plugin.
const { pluck, pipe, without, sortBy, identity, find, propEq, replace, map } = require('ramda')

/**
 * Provides sporking ability to clone templates from a plugin.
 *
 * @param {RuntimeContext} context
 */
module.exports = async function spork (context) {
  const { runtime, prompt, print, filesystem } = context
  const { confirm } = prompt

  //  get a list of plugin namespaces to choose from
  const plugins = pipe(
    pluck('namespace'),
    without(['spork', 'project']),
    sortBy(identity)
  )(runtime.plugins)

  // ask which templates we want
  const answers = await prompt.ask({
    name: 'plugin',
    type: 'list',
    message: 'Choose a plugin',
    choices: plugins
  })
  const plugin = find(propEq('namespace', answers.plugin), runtime.plugins)

  // do we have templates?
  const templatesDir = `${plugin.directory}/templates`
  const hasTemplatesDir = filesystem.exists(templatesDir) === 'dir'
  if (!hasTemplatesDir) {
    print.warning(`${plugin.namespace} has no templates.`)
    return
  }

  // prepare a list of templates to choose from
  const templatePaths = filesystem
    .cwd(templatesDir)
    .find('', { matching: '*.ejs' })

  const templates = map(replace(/\..*$/g, ''), templatePaths)

  const templateAnswers = await prompt.ask({
    name: 'templates',
    type: 'checkbox',
    message: 'Choose templates to copy',
    choices: templates
  })

  // did we select anything?
  if (templateAnswers.templates.length > 0) {
    // the project template/plugin directory
    const destDir = `${filesystem.cwd()}/${runtime.brand}/templates/${plugin.namespace}`

    // go through each of the templates the user has selected
    for (let index = 0; index < templateAnswers.templates.length; index++) {
      // grab the partial template name
      const x = templateAnswers.templates[index]

      // create a print-friendly version
      const printPath = `${runtime.brand}/templates/${plugin.namespace}/${x}.ejs`

      // overwrite checking
      let overwrite = true
      if (filesystem.exists(printPath)) {
        overwrite = await confirm(`overwrite ${printPath}`)
      }

      if (overwrite) {
        // copy the file
        filesystem
          .cwd(templatesDir)
          .copy(`${x}.ejs`, `${destDir}/${x}.ejs`, { overwrite: true })

        // print the news
        print.success(`${print.checkmark} sporked to ${runtime.brand}/templates/${plugin.namespace}/${x}.ejs`)
      } else {
        print.warning(`${print.xmark} sporked to ${runtime.brand}/templates/${plugin.namespace}/${x}.ejs`)
      }
    }// end the loop through the templates to copy
  } else {
    print.info('No templates selected.')
  }
}
