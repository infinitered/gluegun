const test = require('ava')
const Runtime = require('./runtime')

test('loads all sub-directories', t => {
  const r = new Runtime()
  r.loadAll(`${__dirname}/../fixtures/good-plugins`)

  t.is(13, r.plugins.length)
})

test('matches sub-directories', t => {
  const r = new Runtime()
  r.loadAll(`${__dirname}/../fixtures/good-plugins`, { matching: 'blank-*' })
  t.is(1, r.plugins.length)
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
  t.is(0, r.plugins.length)
})
