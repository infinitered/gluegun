const test = require('ava')
const Runtime = require('../../src/domain/runtime')

test('loads all sub-directories', t => {
  const r = new Runtime()
  r.loadAll(`${__dirname}/../fixtures/good-plugins`)
  t.is(r.plugins.length, 10)
})

test('loadAll ignores bad directories', t => {
  const r = new Runtime()
  r.loadAll(__filename)
  r.loadAll(null)
  r.loadAll(undefined)
  r.loadAll('')
  t.is(r.plugins.length, 0)
})

