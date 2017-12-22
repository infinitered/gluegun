const uniqueTempDir = require('unique-temp-dir')

async function command(context) {
  const template = 'special.ejs'
  const dir = uniqueTempDir({ create: true })
  const target = `${dir}/special.txt`
  const props = { thing: context.parameters.first }
  const directory = `${__dirname}/../custom-directory`

  return context.template.generate({ template, target, props, directory })
}

module.exports = { name: 'special', run: command }
