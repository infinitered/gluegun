import * as expect from 'expect'
import { Runtime } from './runtime'

test('loads the core extensions in the right order', () => {
  const r = new Runtime()
  r.addCoreExtensions()
  const list = r.extensions.map(x => x.name).join(', ')

  expect(list).toBe(
    'meta, strings, print, filesystem, semver, system, prompt, http, template, patching, package-manager',
  )
})

test('loads async extensions correctly', async () => {
  const r = new Runtime()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/async-extension`)
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`)

  const toolbox = await r.run('three')
  expect(toolbox.asyncData).toBeDefined()
  expect(toolbox.asyncData.a).toEqual(1)
})
