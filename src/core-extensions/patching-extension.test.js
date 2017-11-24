const test = require('ava')
const jetpack = require('fs-jetpack')
const tempWrite = require('temp-write')
const create = require('./patching-extension')

// const { startsWith } = require('ramdasauce')

const context = {}
create(context)
const patching = context.patching

const CONFIG_STRING = `{
  "test": "what???",
  "test2": "never"
}
`

const TEXT_STRING = `These are some words.

They're very amazing.
`

test.beforeEach(t => {
  t.context.textFile = tempWrite.sync(TEXT_STRING)
})

test('exists - checks a TEXT file for a string', async t => {
  const exists = await patching.exists(t.context.textFile, 'words')
  t.true(exists)
})

test('exists - checks a TEXT file for a short form regex', async t => {
  const exists = await patching.exists(t.context.textFile, /ords\b/)
  t.true(exists)
})

test('exists - checks a TEXT file for a RegExp', async t => {
  const exists = await patching.exists(t.context.textFile, new RegExp('Word', 'i'))
  t.true(exists)
})

test('update - updates a JSON file', async t => {
  const configFile = tempWrite.sync(CONFIG_STRING, '.json')
  const updated = await patching.update(configFile, contents => {
    t.is(typeof contents, 'object')
    t.is(contents.test, 'what???')
    t.is(contents.test2, 'never')

    contents.mutated = true
    return contents
  })

  // returned the updated object
  t.true(updated.mutated)
  t.is(updated.test, 'what???')
  t.is(updated.test2, 'never')

  // file was actually written to with the right contents
  const newContents = await jetpack.read(configFile, 'utf8')
  const expectedContents = `{\n  "test": "what???",\n  "test2": "never",\n  "mutated": true\n}`
  t.is(newContents, expectedContents)
})

test('update - updates a text file', async t => {
  const updated = await patching.update(t.context.textFile, contents => {
    t.is(contents, `These are some words.\n\nThey're very amazing.\n`)

    contents = `These are some different words.\nEven more amazing.\n`
    return contents
  })

  // returned the updated object
  t.is(updated, `These are some different words.\nEven more amazing.\n`)

  // file was actually written to with the right contents
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `These are some different words.\nEven more amazing.\n`
  t.is(newContents, expectedContents)
})

test('update - cancel updating a file', async t => {
  const updated = await patching.update(t.context.textFile, contents => {
    return false
  })

  // returned false
  t.false(updated)

  // file was not altered
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `These are some words.\n\nThey're very amazing.\n`
  t.is(newContents, expectedContents)
})

test('prepend - prepends a text file', async t => {
  const updated = await patching.prepend(t.context.textFile, 'prepended info\n')

  // returned the updated object
  t.is(updated, `prepended info\nThese are some words.\n\nThey're very amazing.\n`)

  // file was actually written to with the right contents
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `prepended info\nThese are some words.\n\nThey're very amazing.\n`
  t.is(newContents, expectedContents)
})

test('append - appends a text file', async t => {
  const updated = await patching.append(t.context.textFile, 'appended info\n')

  // returned the updated object
  t.is(updated, `These are some words.\n\nThey're very amazing.\nappended info\n`)

  // file was actually written to with the right contents
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `These are some words.\n\nThey're very amazing.\nappended info\n`
  t.is(newContents, expectedContents)
})

test('replace - replaces text in a text file', async t => {
  const updated = await patching.replace(t.context.textFile, 'very amazing', 'replaced info')

  // returned the updated object
  t.is(updated, `These are some words.\n\nThey're replaced info.\n`)

  // file was actually written to with the right contents
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `These are some words.\n\nThey're replaced info.\n`
  t.is(newContents, expectedContents)
})

test('patch - replaces text in a text file', async t => {
  const updated = await patching.patch(t.context.textFile, {
    replace: 'very amazing',
    insert: 'patched info'
  })

  // returned the updated object
  t.is(updated, `These are some words.\n\nThey're patched info.\n`)

  // file was actually written to with the right contents
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `These are some words.\n\nThey're patched info.\n`
  t.is(newContents, expectedContents)
})

test('patch - adds text before other text in a text file', async t => {
  const updated = await patching.patch(t.context.textFile, {
    before: 'very amazing',
    insert: 'patched info '
  })

  // returned the updated object
  t.is(updated, `These are some words.\n\nThey're patched info very amazing.\n`)

  // file was actually written to with the right contents
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `These are some words.\n\nThey're patched info very amazing.\n`
  t.is(newContents, expectedContents)
})

test('patch - adds text after other text in a text file', async t => {
  const updated = await patching.patch(t.context.textFile, {
    after: 'some words',
    insert: ' patched info'
  })

  // returned the updated object
  t.is(updated, `These are some words patched info.\n\nThey're very amazing.\n`)

  // file was actually written to with the right contents
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `These are some words patched info.\n\nThey're very amazing.\n`
  t.is(newContents, expectedContents)
})

test('patch - deletes text in a text file', async t => {
  const updated = await patching.patch(t.context.textFile, {
    delete: 'some words'
  })

  // returned the updated object
  t.is(updated, `These are .\n\nThey're very amazing.\n`)

  // file was actually written to with the right contents
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `These are .\n\nThey're very amazing.\n`
  t.is(newContents, expectedContents)
})
