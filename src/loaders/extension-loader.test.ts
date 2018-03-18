import * as expect from 'expect'
import { loadExtensionFromFile } from './extension-loader'

test('loading from a missing file', async () => {
  await expect(() => loadExtensionFromFile('foo.js', 'extension')).toThrowError(
    `Error: couldn't load command (not a file): foo.js`,
  )
})

test('deals with wierd input', async () => {
  await expect(() => loadExtensionFromFile('')).toThrowError(`Error: couldn't load extension (file is blank): `)
})

test('open a wierd js file', async () => {
  const file = `${__dirname}/../fixtures/bad-modules/text.js`
  await expect(() => loadExtensionFromFile(file, 'extension')).toThrowError(`hello is not defined`)
})

test('default but none exported', async () => {
  const file = `${__dirname}/../fixtures/good-modules/module-exports-object.js`
  await expect(() => loadExtensionFromFile(file, 'extension')).toThrowError(
    `Error: couldn't load module-exports-object. Expected a function, got [object Object].`,
  )
})

test('has front matter', async () => {
  const file = `${__dirname}/../fixtures/good-plugins/front-matter/extensions/hello.js`
  const extension = loadExtensionFromFile(file, 'extension')
  expect(typeof extension.setup).toBe('function')
  expect(extension.name).toBe('hello')
})
