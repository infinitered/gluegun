export default async (context) => {
  const template = 'props.njk'
  const dir = context.directories['root'] || 'generated'
  const target = `${dir}/props.txt`
  const props = {
    thing: 'world',
    colors: [ 'red', 'green', 'blue' ]
  }

  return context.generate({ template, target, props })
}
