async function command (context) {
  const template = 'props.ejs'
  const dir = 'generated'
  const target = `${dir}/props.txt`
  const props = {
    thing: 'world',
    colors: [ 'red', 'green', 'blue' ]
  }

  return context.template.generate({ template, target, props })
}

module.exports = command
