import * as expect from 'expect'
import { join, pipe, pluck } from 'ramda'
import { Runtime } from './runtime'

test('loads the core extensions in the right order', () => {
  const r = new Runtime()
  r.addCoreExtensions()
  const list = pipe(
    pluck('name'),
    join(', '),
  )(r.extensions)

  expect(list).toBe('meta, strings, print, filesystem, semver, system, prompt, http, template, patching')
})
