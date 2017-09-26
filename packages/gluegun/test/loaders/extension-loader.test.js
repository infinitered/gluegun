const test = require('ava')
const load = require('../../src/loaders/extension-loader')

test('loading from a missing file', async t => {
  const error = await t.throws(() => load('foo.js', 'extension'), Error)
  t.is(error.message, `Error: couldn\'t load command (not a file): foo.js`)
})

test('deals with wierd input', async t => {
  const error = await t.throws(() => load(), Error)
  t.is(error.message, `Error: couldn\'t load extension (file is blank): undefined`)
})

test('open a wierd js file', async t => {
  const file = `${__dirname}/../fixtures/bad-modules/text.js`
  const error = await t.throws(() => load(file, 'extension'), Error)
  t.is(error.message, `hello is not defined`)
})

test('default but none exported', async t => {
  const file = `${__dirname}/../fixtures/good-modules/module-exports-object.js`
  const error = await t.throws(() => load(file, 'extension'), Error)
  t.is(error.message, `commandModule is not defined`)
})

test('fat arrows', async t => {
  const file = `${__dirname}/../fixtures/good-modules/module-exports-fat-arrow-fn.js`
  const extension = load(file, 'extension')
  t.is(typeof extension.setup, 'function')
})

test('has front matter', async t => {
  const file = `${__dirname}/../fixtures/good-plugins/front-matter/extensions/hello.js`
  const extension = load(file, 'extension')
  t.is(typeof extension.setup, 'function')
  t.is(extension.name, 'hello')
})
