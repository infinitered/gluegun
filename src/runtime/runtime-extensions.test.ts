import * as expect from 'expect'
import { Runtime } from './runtime'
import { DEFAULTS } from './run'

test('loads the core extensions in the right order', () => {
  const r = new Runtime()
  r.addCoreExtensions()
  const list = r.extensions.map(x => x.name).join(', ')

  expect(list).toBe('meta, strings, print, filesystem, semver, system, prompt, http, template, patching')
})

test('loads async extensions correctly', async () => {
  const r = new Runtime()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/async-extension`)
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`)

  const toolbox = await r.run('three')
  expect(toolbox['asyncData']).toBeDefined()
  expect(toolbox['asyncData'].a).toEqual(1)
})

afterEach(() => (DEFAULTS.extensionTimeout = 10000))

test('timeouts long async extensions', async () => {
  const r = new Runtime()
  r.addPlugin(`${__dirname}/../fixtures/bad-plugins/long-async`)
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`)
  DEFAULTS.extensionTimeout = 1000

  await expect(r.run('three')).rejects.toThrowErrorMatchingSnapshot()
}, 1500)
