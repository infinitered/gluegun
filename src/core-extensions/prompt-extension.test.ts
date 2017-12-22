import test from 'ava'
import RunContext from '../domain/run-context'
const createExtension = require('./prompt-extension')

test('has the proper interface', t => {
  const context = new RunContext()
  createExtension(context)
  const ext = context.prompt
  t.truthy(ext)
  t.is(typeof ext.ask, 'function')
  t.is(typeof ext.separator, 'function')
  t.is(typeof ext.question, 'function')
})
