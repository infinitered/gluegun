async function missing (context) {
  const template = 'missing.ejs'
  const dir = 'generated'
  const target = `${dir}/missing.txt`

  const result = await context.template.generate({ template, target })
  return result
}

module.exports = missing
