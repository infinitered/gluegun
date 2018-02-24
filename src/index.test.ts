import test from 'ava'
import * as exported from './index'

test('create', t => {
  t.truthy(exported)
  t.is(typeof exported.build, 'function')
  const { build } = exported
  const runtime = build()
    .brand('test')
    .create()
  t.is(runtime.brand, 'test')
})
