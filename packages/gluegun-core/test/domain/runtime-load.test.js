const test = require('ava')
const Runtime = require('../../src/domain/runtime')

test('load a directory', t => {
  const r = new Runtime()
  r.load(`${__dirname}/../fixtures/good-plugins/simplest`)
  r.load(`${__dirname}/../fixtures/good-plugins/threepack`)
  t.is(r.plugins.length, 2)
})

test('allows plugins with broken dirs', t => {
  const r = new Runtime()
  r.load(__filename)
  t.is(r.plugins.length, 1)
})
