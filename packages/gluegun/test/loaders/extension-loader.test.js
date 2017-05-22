const test = require('ava')
const load = require('../../src/loaders/extension-loader')

test('loading from a missing file', t => {
  const extension = load('foo.js', 'extension')
  t.falsy(extension.setup)
  t.falsy(extension.exception)
  t.is(extension.loadState, 'error')
  t.is(extension.errorState, 'missing')
})

test('deals with wierd input', t => {
  const extension = load()
  t.falsy(extension.setup)
  t.falsy(extension.exception)
  t.is(extension.loadState, 'error')
  t.is(extension.errorState, 'input')
})

test('open a wierd js file', t => {
  const file = `${__dirname}/../fixtures/bad-modules/text.js`
  const extension = load(file, 'extension')
  t.falsy(extension.setup)
  t.truthy(extension.exception)
  t.is(extension.loadState, 'error')
  t.is(extension.errorState, 'badfile')
})

test('default but none exported', t => {
  const file = `${__dirname}/../fixtures/good-modules/module-exports-object.js`
  const extension = load(file, 'extension')
  t.falsy(extension.setup)
  t.falsy(extension.exception)
  t.is(extension.loadState, 'error')
  t.is(extension.errorState, 'badfunction')
})

test('fat arrows', t => {
  const file = `${__dirname}/../fixtures/good-modules/module-exports-fat-arrow-fn.js`
  const extension = load(file, 'extension')
  t.falsy(extension.exception)
  t.is(typeof extension.setup, 'function')
  t.is(extension.loadState, 'ok')
  t.is(extension.errorState, 'none')
})

test('has front matter', t => {
  const file = `${__dirname}/../fixtures/good-plugins/front-matter/extensions/hello.js`
  const extension = load(file, 'extension')
  t.falsy(extension.exception)
  t.is(typeof extension.setup, 'function')
  t.is(extension.loadState, 'ok')
  t.is(extension.errorState, 'none')
  t.is(extension.name, 'hello')
})
