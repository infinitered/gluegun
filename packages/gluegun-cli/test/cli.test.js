const test = require('ava')
const cli = require('../src/cli')

test('can start the cli', async t => {
  const c = await cli()
  t.truthy(c)
})

test('cli shows new', async t => {
  const c = await cli([null, null, 'new', 'Foo'])
  t.is(c.command.name, 'new')
})

test('cli shows help by default', async t => {
  const c = await cli([null, null])
  t.is(c.command.name, 'help')
});


