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

test('update - updates a file', async t => {
  const updated = await patching.update(CONFIG_FILE, (contents) => {
    t.is(typeof contents, 'object')
    t.is(contents.test, 'what???')
    t.is(contents.test2, 'never')
    
    contents.mutated = true
    return contents
  })

  // Returned the updated object
  t.truthy(updated.mutated)
  t.is(updated.test, 'what???')
  t.is(updated.test2, 'never')

  // File was actually written to with the right contents
  const newContents = await jetpack.read(CONFIG_FILE, 'utf8')
  const expectedContents = `{\n  "test": "what???",\n  "test2": "never",\n  "mutated": true\n}`
  t.is(newContents, expectedContents)
})

