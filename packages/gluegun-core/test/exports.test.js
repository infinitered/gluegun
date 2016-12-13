const test = require('ava')
const idx = require('../src/index')

test('create', t => {
  const exported = idx
  t.truthy(exported)
  t.is(typeof exported.create, 'function')
  const runtime = exported.create('test')
  t.is(runtime.brand, 'test')
})
