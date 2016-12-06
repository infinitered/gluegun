async function command (context) {
  const template = 'props.njk'
  const dir = 'generated'
  const target = `${dir}/props.txt`
  const props = {
    thing: 'world',
    colors: [ 'red', 'green', 'blue' ]
  }

  return await context.template.generate({ template, target, props, askToOverwrite: false })
}

module.exports = command
