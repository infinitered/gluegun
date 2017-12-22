import test from 'ava'
import Runtime from './runtime'

test('runs a command', async t => {
  const r = new Runtime()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`)
  const context = await r.run('3pack three')

  t.deepEqual(context.result, [1, 2, 3])
})

test('runs an aliased command', async t => {
  const r = new Runtime()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`)
  const context = await r.run('3pack o')

  t.is(context.result, 1)
})

test('runs a nested command', async t => {
  const r = new Runtime()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/nested`)
  const context = await r.run('thing foo')
  t.truthy(context.command)
  t.is(context.command.name, 'foo')
  t.deepEqual(context.command.commandPath, ['thing', 'foo'])
  t.is(context.result, 'nested thing foo has run')
})

test('runs a command with no name prop', async t => {
  const r = new Runtime()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/missing-name`)
  const context = await r.run('missing-name foo')
  t.truthy(context.command)
  t.is(context.command.name, 'foo')
})
