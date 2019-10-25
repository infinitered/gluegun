const uniqueTempDir = require('unique-temp-dir')

async function command(toolbox) {
  const template = 'special.ejs'
  const dir = uniqueTempDir({ create: true })
  const target = `${dir}/special.txt`
  const props = { thing: toolbox.parameters.first }
  const directory = `${__dirname}/../../custom-directory`

  return toolbox.template.generate({ template, target, props, directory })
}

module.exports = { name: 'special', run: command }
