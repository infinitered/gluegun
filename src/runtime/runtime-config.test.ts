import * as expect from 'expect'
import { Runtime } from './runtime'

test('can read from config', async () => {
  const r = new Runtime()
  r.addCoreExtensions()
  const plugin = r.addPlugin(`${__dirname}/../fixtures/good-plugins/args`)
  const toolbox = await r.run('config')

  expect(plugin.defaults).toBeTruthy()
  expect(plugin.defaults.color).toBe('blue')
  expect(toolbox.result).toBe('blue')
})

test('project config trumps plugin config', async () => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.defaults = { args: { color: 'red' } }
  const plugin = r.addPlugin(`${__dirname}/../fixtures/good-plugins/args`)
  const toolbox = await r.run('config')

  expect(plugin.defaults).toBeTruthy()
  expect(plugin.defaults.color).toBe('blue')
  expect(toolbox.result).toBe('red')
})
