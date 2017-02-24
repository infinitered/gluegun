const test = require('ava')
const createExtension = require(
  '../../src/core-extensions/filesystem-extension'
)
const os = require('os')
const path = require('path')
const { split } = require('ramda')

test('has the proper interface', t => {
  const ext = createExtension()
  t.truthy(ext)
  // a few dumb checks to ensure we're talking to jetpack
  t.is(typeof ext.copy, 'function')
  t.is(typeof ext.path, 'function')
  t.is(split('\n', ext.read(__filename))[0], "const test = require('ava')")
  // the extra values we've added
  t.is(ext.eol, os.EOL)
  t.is(ext.separator, path.sep)
})
