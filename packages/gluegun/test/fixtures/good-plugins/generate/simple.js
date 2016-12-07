async function simple (context) {
  const template = 'simple.njk'
  const dir = 'generated'
  const target = `${dir}/simple.txt`

  const result = await context.template.generate({ template, target, askToOverwrite: false })
  return result
}

module.exports = simple
