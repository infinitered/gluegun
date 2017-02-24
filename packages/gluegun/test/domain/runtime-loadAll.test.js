const test = require('ava')
const Runtime = require('../../src/domain/runtime')

test('loads all sub-directories', t => {
  const r = new Runtime()
  r.loadAll(`${__dirname}/../fixtures/good-plugins`)

  t.is(r.plugins.length, 11)
})

test('matches sub-directories', t => {
  const r = new Runtime()
  r.loadAll(`${__dirname}/../fixtures/good-plugins`, { matching: 'blank-*' })
  t.is(r.plugins.length, 1)
})

test('hides commands', t => {
  const r = new Runtime()
  r.loadAll(`${__dirname}/../fixtures/good-plugins`, {
    matching: 'threepack',
    hidden: true
  })
  t.is(r.plugins.length, 1)
  t.true(r.plugins[0].commands[2].hidden)
})

test('loadAll ignores bad directories', t => {
  const r = new Runtime()
  r.loadAll(__filename)
  r.loadAll(null)
  r.loadAll(undefined)
  r.loadAll('')
  t.is(r.plugins.length, 0)
})
