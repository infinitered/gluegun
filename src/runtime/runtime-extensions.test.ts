import test from 'ava'
import { join, pipe, pluck } from 'ramda'
import { Runtime } from './runtime'

test('loads the core extensions in the right order', t => {
  const r = new Runtime()
  r.addCoreExtensions()
  const list = pipe(pluck('name'), join(', '))(r.extensions)

  t.is(list, 'meta, strings, print, filesystem, semver, system, prompt, http, template, patching')
})
