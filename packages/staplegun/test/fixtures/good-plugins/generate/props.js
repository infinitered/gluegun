export default async (context) => {
  const source = 'props.njk'
  const dir = context.directories['root'] || 'generated'
  const target = `${dir}/props.txt`
  const props = {
    thing: 'world',
    colors: [ 'red', 'green', 'blue' ]
  }

  return context.generate(source, target, props)
}
