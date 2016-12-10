const test = require('ava')
const createExtension = require('../../src/core-extensions/strings-extension')

test('has the proper interface', t => {
  const ext = createExtension()
  t.truthy(ext)
  t.is(typeof ext.trim, 'function')
  t.is(ext.trim('  lol'), 'lol')
})
