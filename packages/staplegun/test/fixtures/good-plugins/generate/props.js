async function command (context) {
  const template = 'props.njk'
  const dir = context.directories['root'] || 'generated'
  const target = `${dir}/props.txt`
  const props = {
    thing: 'world',
    colors: [ 'red', 'green', 'blue' ]
  }

  const result = await context.template.generate({ template, target, props, askToOverwrite: false })
  return result
}

module.exports = command
