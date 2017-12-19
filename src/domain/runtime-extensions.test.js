const test = require('ava')
const Runtime = require('./runtime')
const { pipe, pluck, join } = require('ramda')

test('loads the core extensions in the right order', t => {
  const r = new Runtime()
  const list = pipe(pluck('name'), join(', '))(r.extensions)

  t.is(list, 'meta, strings, print, template, filesystem, semver, system, http, prompt, patching')
})
