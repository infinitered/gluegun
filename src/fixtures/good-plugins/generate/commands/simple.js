const uniqueTempDir = require('unique-temp-dir')

async function simple(toolbox) {
  const template = 'simple.ejs'
  const dir = uniqueTempDir({ create: true })
  const target = `${dir}/simple.txt`

  const result = await toolbox.template.generate({ template, target })
  return result
}

module.exports = { name: 'simple', run: simple }
