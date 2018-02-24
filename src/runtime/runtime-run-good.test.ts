import test from 'ava'
import { Runtime } from './runtime'

test('runs a command', async t => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`)
  const toolbox = await r.run('three')

  t.deepEqual(toolbox.result, [1, 2, 3])
})

test('runs an aliased command', async t => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`)
  const toolbox = await r.run('o')

  t.is(toolbox.result, 1)
})

test('runs a nested command', async t => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/nested`)
  const toolbox = await r.run('thing foo')
  t.truthy(toolbox.command)
  t.is(toolbox.command.name, 'foo')
  t.deepEqual(toolbox.command.commandPath, ['thing', 'foo'])
  t.is(toolbox.result, 'nested thing foo has run')
})

test('runs a command with no name prop', async t => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/missing-name`)
  const toolbox = await r.run('foo')
  t.truthy(toolbox.command)
  t.is(toolbox.command.name, 'foo')
})
