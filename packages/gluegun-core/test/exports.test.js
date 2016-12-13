const test = require('ava')
const idx = require('../src/index')

test('create', t => {
  const exported = idx
  t.truthy(exported)
  t.is(typeof exported.build, 'function')
  const { build } = exported
  const runtime = build().brand('test').createRuntime()
  t.is(runtime.brand, 'test')
})
