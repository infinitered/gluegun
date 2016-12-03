import test from 'ava'
import Runtime from '../src/runtime'

test('loads the runtime', t => {
  const r = new Runtime()
  t.truthy(r)
  t.is(r.plugins.length, 0)
})

test('adds a directory', t => {
  const r = new Runtime()
  r.addPluginFromDirectory(`${__dirname}/fixtures/good-plugins/simplest`)
  r.addPluginFromDirectory(`${__dirname}/fixtures/good-plugins/threepack`)

  t.is(r.plugins.length, 2)
})

test('gets a list of commands', t => {
  const r = new Runtime()
  r.addPluginFromDirectory(`${__dirname}/fixtures/good-plugins/simplest`)
  const p1 = r.addPluginFromDirectory(`${__dirname}/fixtures/good-plugins/threepack`)
  const c0 = p1.commands[0]
  const list = r.listCommands()

  t.is(list.length, 3)
  t.deepEqual(list[0], { plugin: p1.namespace, command: c0.name, description: c0.description })
})

test('cannot find a command', async t => {
  const r = new Runtime()
  const context = await r.run('bloo', 'blah', {})

  t.truthy(context)
  t.is(context.fullArguments, 'blah')
  t.falsy(context.arguments)
  t.falsy(context.stringArguments)
  t.falsy(context.command)
  t.falsy(context.plugin)
  t.falsy(context.result)
  t.deepEqual(context.options, {})
})

test('runs a command', async t => {
  const r = new Runtime()
  r.addPluginFromDirectory(`${__dirname}/fixtures/good-plugins/simplest`)
  const plugin = r.addPluginFromDirectory(`${__dirname}/fixtures/good-plugins/threepack`)
  const context = await r.run('3pack', 'three')

  t.truthy(context)
  t.is(context.fullArguments, 'three')
  t.deepEqual(context.arguments, [])
  t.deepEqual(context.stringArguments, '')
  t.is(context.plugin, plugin)
  t.is(context.command, plugin.commands[2])
  t.deepEqual(context.result, [1, 2, 3])
})

test('can pass arguments', async t => {
  const r = new Runtime()
  const plugin = r.addPluginFromDirectory(`${__dirname}/fixtures/good-plugins/args`)
  const context = await r.run('say', 'hello steve kellock', { caps: false })
  t.truthy(context)
  t.is(context.fullArguments, 'hello steve kellock')
  t.deepEqual(context.arguments, ['steve', 'kellock'])
  t.deepEqual(context.stringArguments, 'steve kellock')
  t.is(context.plugin, plugin)
  t.is(context.command, plugin.commands[0])
  t.is(context.result, 'hi steve kellock')
  t.deepEqual(context.options, { caps: false })
})
