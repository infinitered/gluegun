import test from 'ava'
import RunContext from '../domain/run-context'
const createExtension = require('./strings-extension')

test('has the proper interface', t => {
  const context = new RunContext()
  createExtension(context)
  const ext = context.strings
  t.truthy(ext)
  t.is(typeof ext.trim, 'function')
  t.is(ext.trim('  lol'), 'lol')
})
