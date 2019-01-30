const uniqueTempDir = require('unique-temp-dir')

async function missing(toolbox) {
  const template = 'missing.ejs'
  const dir = uniqueTempDir({ create: true })
  const target = `${dir}/missing.txt`

  const result = await toolbox.template.generate({ template, target })
  return result
}

module.exports = { name: 'missing', run: missing }
