async function command (context) {
  const template = 'special.ejs'
  const dir = 'generated'
  const target = `${dir}/special.txt`
  const props = { thing: context.parameters.first }
  const directory = `${__dirname}/../custom-directory`

  return context.template.generate({ template, target, props, directory })
}

module.exports = command
