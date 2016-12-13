const test = require('ava')
const createExtension = require('../../src/core-extensions/prompt-extension')

test('has the proper interface', t => {
  const ext = createExtension()
  t.truthy(ext)
  t.is(typeof ext.ask, 'function')
  t.is(typeof ext.separator, 'function')
  t.is(typeof ext.question, 'function')
})
