const test = require('ava')
const Runtime = require('./runtime')

test('runs a command', async t => {
  const r = new Runtime()
  r.load(`${__dirname}/../fixtures/good-plugins/threepack`)
  const context = await r.run('3pack three')

  t.deepEqual(context.result, [1, 2, 3])
})

test('runs an aliased command', async t => {
  const r = new Runtime()
  r.load(`${__dirname}/../fixtures/good-plugins/threepack`)
  const context = await r.run('3pack o')

  t.is(context.result, 1)
})

test('runs a nested command', async t => {
  const r = new Runtime()
  r.load(`${__dirname}/../fixtures/good-plugins/nested`)
  const context = await r.run('nested thing foo')
  t.truthy(context.command)
  t.is(context.command.name, 'foo')
  t.deepEqual(context.command.commandPath, ['thing', 'foo'])
  t.is(context.result, 'nested thing foo has run')
})
