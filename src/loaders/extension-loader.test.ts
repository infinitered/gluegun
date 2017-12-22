import test from 'ava'
import { loadExtensionFromFile } from './extension-loader'

test('loading from a missing file', async t => {
  const error = await t.throws(() => loadExtensionFromFile('foo.js', 'extension'), Error)
  t.is(error.message, `Error: couldn't load command (not a file): foo.js`)
})

test('deals with wierd input', async t => {
  const error = await t.throws(() => loadExtensionFromFile(''), Error)
  t.is(error.message, `Error: couldn't load extension (file is blank): `)
})

test('open a wierd js file', async t => {
  const file = `${__dirname}/../fixtures/bad-modules/text.js`
  const error = await t.throws(() => loadExtensionFromFile(file, 'extension'), Error)
  t.is(error.message, `hello is not defined`)
})

test('default but none exported', async t => {
  const file = `${__dirname}/../fixtures/good-modules/module-exports-object.js`
  const error = await t.throws(() => loadExtensionFromFile(file, 'extension'), Error)
  t.is(error.message, `Error: couldn't load module-exports-object. Expected a function, got [object Object].`)
})

test('has front matter', async t => {
  const file = `${__dirname}/../fixtures/good-plugins/front-matter/extensions/hello.js`
  const extension = loadExtensionFromFile(file, 'extension')
  t.is(typeof extension.setup, 'function')
  t.is(extension.name, 'hello')
})
