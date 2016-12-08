const test = require('ava')
const createExtension = require('../../src/extensions/http-extension')

test('has the proper interface', t => {
  const ext = createExtension()
  t.truthy(ext)
  t.is(typeof ext.create, 'function')
})
