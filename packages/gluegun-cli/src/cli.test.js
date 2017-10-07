const test = require('ava')
const cli = require('../src/cli')

test('can start the cli', async t => {
  const c = await cli()
  t.truthy(c)
})

test('cli shows new', async t => {
  const c = await cli(['/bin/node', '/bin/gluegun', 'new', 'Foo'])
  t.is(c.command.name, 'new')
})

test('cli shows default', async t => {
  const c = await cli(['/bin/node', '/bin/gluegun'])
  t.is(c.command.name, 'gluegun')
})
