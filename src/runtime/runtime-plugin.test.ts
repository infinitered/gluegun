import * as expect from 'expect'
import { Runtime } from './runtime'

const BAD_PLUGIN_PATH = `${__dirname}/../fixtures/does-not-exist`

test('load a directory', () => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/simplest`)
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`)
  expect(r.plugins.length).toBe(2)
})

test('hides commands', () => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`, { hidden: true })
  expect(r.plugins.length).toBe(1)
  expect(r.plugins[0].commands[2].hidden).toBe(true)
})

test('silently ignore plugins with broken dirs', async () => {
  const r = new Runtime()
  r.addCoreExtensions()
  const error = r.addPlugin(BAD_PLUGIN_PATH)
  expect(undefined).toBe(error)
})

test("throws error if plugin doesn't exist and required: true", async () => {
  const r = new Runtime()
  r.addCoreExtensions()
  await expect(() => r.addPlugin(BAD_PLUGIN_PATH, { required: true })).toThrowError(
    `Error: couldn't load plugin (not a directory): ${BAD_PLUGIN_PATH}`,
  )
})
