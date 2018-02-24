import test from 'ava'
import { Runtime } from './runtime'

test('can read from config', async t => {
  const r = new Runtime()
  r.addCoreExtensions()
  const plugin = r.addPlugin(`${__dirname}/../fixtures/good-plugins/args`)
  const toolbox = await r.run('config')

  t.truthy(plugin.defaults)
  t.is(plugin.defaults.color, 'blue')
  t.is(toolbox.result, 'blue')
})

test('project config trumps plugin config', async t => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.defaults = { args: { color: 'red' } }
  const plugin = r.addPlugin(`${__dirname}/../fixtures/good-plugins/args`)
  const toolbox = await r.run('config')

  t.truthy(plugin.defaults)
  t.is(plugin.defaults.color, 'blue')
  t.is(toolbox.result, 'red')
})
