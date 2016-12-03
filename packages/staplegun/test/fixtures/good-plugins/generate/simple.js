export default async (context) => {
  const source = 'simple.njk'
  const dir = context.directories['root'] || 'generated'
  const target = `${dir}/simple.txt`

  return context.generate(source, target)
}
