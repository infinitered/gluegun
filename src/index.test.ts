import test from 'ava'
import * as exported from './index'

test('create', t => {
  t.truthy(exported)
  t.is(typeof exported.build, 'function')
  const { build } = exported
  const runtime = build('test').create()
  t.is(runtime.brand, 'test')
  const runtime2 = build()
    .brand('test2')
    .create()
  t.is(runtime2.brand, 'test2')
})
