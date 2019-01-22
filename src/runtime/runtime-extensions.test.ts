import * as expect from 'expect'
import { Runtime } from './runtime'

test('loads the core extensions in the right order', () => {
  const r = new Runtime()
  r.addCoreExtensions()
  const list = r.extensions.map(x => x.name).join(', ')

  expect(list).toBe('meta, strings, print, filesystem, semver, system, prompt, http, template, patching')
})
