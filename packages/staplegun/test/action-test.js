import test from 'ava'
import { createAction } from '../src/action'

test('actions are created with a valid type', t => {
  t.throws(() => createAction())
  t.throws(() => createAction(null))
  t.throws(() => createAction(1))
  t.throws(() => createAction(''))
  t.throws(() => createAction(' '))
  t.truthy(createAction('hello'))
})

test('empty arguments are created', t => {
  const a = createAction('hi')
  t.deepEqual(a.arguments, [])
})

test('empty options are created', t => {
  const a = createAction('hi')
  t.deepEqual(a.options, {})
})

