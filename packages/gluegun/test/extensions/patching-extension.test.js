const test = require('ava')
const jetpack = require('fs-jetpack')
const create = require('../../src/core-extensions/patching-extension')

// const { startsWith } = require('ramdasauce')

const patching = create()

const CONFIG_SOURCE_FILE = 'test/fixtures/patching/config.json'
const CONFIG_FILE = 'test/fixtures/patching/config-test.json'
const TEXT_SOURCE_FILE = 'test/fixtures/patching/words.txt'
const TEXT_FILE = 'test/fixtures/patching/words-test.txt'

const removeTempFiles = async () => {
  jetpack.remove(CONFIG_FILE)
  jetpack.remove(TEXT_FILE)
}

test.before(() => {
  removeTempFiles()
  jetpack.copy(CONFIG_SOURCE_FILE, CONFIG_FILE)
  jetpack.copy(TEXT_SOURCE_FILE, TEXT_FILE)
})

test.after(removeTempFiles)

test('update - updates a JSON file', async t => {
  const updated = await patching.update(CONFIG_FILE, (contents) => {
    t.is(typeof contents, 'object')
    t.is(contents.test, 'what???')
    t.is(contents.test2, 'never')
    
    contents.mutated = true
    return contents
  })

  // returned the updated object
  t.truthy(updated.mutated)
  t.is(updated.test, 'what???')
  t.is(updated.test2, 'never')

  // file was actually written to with the right contents
  const newContents = await jetpack.read(CONFIG_FILE, 'utf8')
  const expectedContents = `{\n  "test": "what???",\n  "test2": "never",\n  "mutated": true\n}`
  t.is(newContents, expectedContents)
})

test('update - updates a text file', async t => {
  const updated = await patching.update(TEXT_FILE, (contents) => {
    t.is(contents, `These are some words.\n\nThey're very amazing.\n`)
    
    contents = `These are some different words.\nEven more amazing.\n`
    return contents
  })

  // returned the updated object
  t.is(updated, `These are some different words.\nEven more amazing.\n`)
  
  // file was actually written to with the right contents
  const newContents = await jetpack.read(TEXT_FILE, 'utf8')
  const expectedContents = `These are some different words.\nEven more amazing.\n`
  t.is(newContents, expectedContents)
})

test('update - cancel updating a file', async t => {
  const updated = await patching.update(TEXT_FILE, (contents) => {
    return false
  })

  // returned false
  t.falsy(updated)
  
  // file was not altered
  const newContents = await jetpack.read(TEXT_FILE, 'utf8')
  const expectedContents = `These are some words.\n\nThey're very amazing.\n`
  t.is(newContents, expectedContents)
})
