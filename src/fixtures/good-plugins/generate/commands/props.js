const uniqueTempDir = require('unique-temp-dir')

async function command(toolbox) {
  const template = 'props.ejs'
  const dir = uniqueTempDir({ create: true })
  const target = `${dir}/props.txt`
  const props = {
    thing: 'world',
    colors: ['red', 'green', 'blue'],
  }

  return toolbox.template.generate({ template, target, props })
}

module.exports = { name: 'props', run: command }
