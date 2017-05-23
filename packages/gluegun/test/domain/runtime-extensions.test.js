const test = require('ava')
const Runtime = require('../../src/domain/runtime')
const { pipe, pluck, join } = require('ramda')

test('loads the core extensions in the right order', t => {
  const r = new Runtime()
  const list = pipe(pluck('name'), join(', '))(r.extensions)

  t.is(list, 'strings, print, template, filesystem, system, http, prompt, patching')
})
