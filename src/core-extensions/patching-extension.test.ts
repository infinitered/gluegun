import * as expect from 'expect'
import * as jetpack from 'fs-jetpack'
import * as tempWrite from 'temp-write'
import { Toolbox } from '../domain/toolbox'
import create from './patching-extension'

const toolbox = new Toolbox()
create(toolbox)
const patching = toolbox.patching

const CONFIG_STRING = `{
  "test": "what???",
  "test2": "never"
}
`

const TEXT_STRING = `These are some words.

They're very amazing.
`

const t = { context: { textFile: null } }

beforeEach(() => {
  t.context.textFile = tempWrite.sync(TEXT_STRING)
})

test('exists - checks a TEXT file for a string', async () => {
  const exists = await patching.exists(t.context.textFile, 'words')
  expect(exists).toBe(true)
})

test('exists - checks a TEXT file for a short form regex', async () => {
  const exists = await patching.exists(t.context.textFile, /ords\b/)
  expect(exists).toBe(true)
})

test('exists - checks a TEXT file for a RegExp', async () => {
  const exists = await patching.exists(t.context.textFile, new RegExp('Word', 'i'))
  expect(exists).toBe(true)
})

test('update - updates a JSON file', async () => {
  const configFile = tempWrite.sync(CONFIG_STRING, '.json')
  const updated = (await patching.update(configFile, contents => {
    expect(typeof contents).toBe('object')
    expect(contents.test).toBe('what???')
    expect(contents.test2).toBe('never')

    contents.mutated = true
    return contents
  })) as { [key: string]: any }

  // returned the updated object
  expect(updated).toBeTruthy()
  expect(updated.mutated).toBe(true)
  expect(updated.test).toBe('what???')
  expect(updated.test2).toBe('never')

  // file was actually written to with the right contents
  const newContents = await jetpack.read(configFile, 'utf8')
  const expectedContents = `{\n  "test": "what???",\n  "test2": "never",\n  "mutated": true\n}`
  expect(newContents).toBe(expectedContents)
})

test('update - updates a text file', async () => {
  const updated = await patching.update(t.context.textFile, contents => {
    expect(contents).toBe(`These are some words.\n\nThey're very amazing.\n`)

    contents = `These are some different words.\nEven more amazing.\n`
    return contents
  })

  // returned the updated object
  expect(updated).toBe(`These are some different words.\nEven more amazing.\n`)

  // file was actually written to with the right contents
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `These are some different words.\nEven more amazing.\n`
  expect(newContents).toBe(expectedContents)
})

test('update - cancel updating a file', async () => {
  const updated = await patching.update(t.context.textFile, contents => {
    return false
  })

  // returned false
  expect(updated).toBe(false)

  // file was not altered
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `These are some words.\n\nThey're very amazing.\n`
  expect(newContents).toBe(expectedContents)
})

test('prepend - prepends a text file', async () => {
  const updated = await patching.prepend(t.context.textFile, 'prepended info\n')

  // returned the updated object
  expect(updated).toBe(`prepended info\nThese are some words.\n\nThey're very amazing.\n`)

  // file was actually written to with the right contents
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `prepended info\nThese are some words.\n\nThey're very amazing.\n`
  expect(newContents).toBe(expectedContents)
})

test('append - appends a text file', async () => {
  const updated = await patching.append(t.context.textFile, 'appended info\n')

  // returned the updated object
  expect(updated).toBe(`These are some words.\n\nThey're very amazing.\nappended info\n`)

  // file was actually written to with the right contents
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `These are some words.\n\nThey're very amazing.\nappended info\n`
  expect(newContents).toBe(expectedContents)
})

test('replace - replaces text in a text file', async () => {
  const updated = await patching.replace(t.context.textFile, 'very amazing', 'replaced info')

  // returned the updated object
  expect(updated).toBe(`These are some words.\n\nThey're replaced info.\n`)

  // file was actually written to with the right contents
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `These are some words.\n\nThey're replaced info.\n`
  expect(newContents).toBe(expectedContents)
})

test('patch - replaces text in a text file', async () => {
  const updated = await patching.patch(t.context.textFile, {
    replace: 'very amazing',
    insert: 'patched info',
  })

  // returned the updated object
  expect(updated).toBe(`These are some words.\n\nThey're patched info.\n`)

  // file was actually written to with the right contents
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `These are some words.\n\nThey're patched info.\n`
  expect(newContents).toBe(expectedContents)
})

test('patch - adds text before other text in a text file', async () => {
  const updated = await patching.patch(t.context.textFile, {
    before: 'very amazing',
    insert: 'patched info ',
  })

  // returned the updated object
  expect(updated).toBe(`These are some words.\n\nThey're patched info very amazing.\n`)

  // file was actually written to with the right contents
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `These are some words.\n\nThey're patched info very amazing.\n`
  expect(newContents).toBe(expectedContents)
})

test('patch - adds text after other text in a text file', async () => {
  const updated = await patching.patch(t.context.textFile, {
    after: 'some words',
    insert: ' patched info',
  })

  // returned the updated object
  expect(updated).toBe(`These are some words patched info.\n\nThey're very amazing.\n`)

  // file was actually written to with the right contents
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `These are some words patched info.\n\nThey're very amazing.\n`
  expect(newContents).toBe(expectedContents)
})

test('patch - deletes text in a text file', async () => {
  const updated = await patching.patch(t.context.textFile, {
    delete: 'some words',
  })

  // returned the updated object
  expect(updated).toBe(`These are .\n\nThey're very amazing.\n`)

  // file was actually written to with the right contents
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `These are .\n\nThey're very amazing.\n`
  expect(newContents).toBe(expectedContents)
})

test('patch - able to patch with regex as the value', async () => {
  const updated = await patching.patch(t.context.textFile, {
    after: new RegExp('some words'),
    insert: ' patched info',
  })

  // returned the updated object
  expect(updated).toBe(`These are some words patched info.\n\nThey're very amazing.\n`)

  // file was actually written to with the right contents
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `These are some words patched info.\n\nThey're very amazing.\n`
  expect(newContents).toBe(expectedContents)
})

test('patch - replaces text in a text file with regex as insert value', async () => {
  const updated = await patching.patch(t.context.textFile, {
    replace: new RegExp('very amazing'),
    insert: 'patched info',
  })

  // returned the updated object
  expect(updated).toBe(`These are some words.\n\nThey're patched info.\n`)

  // file was actually written to with the right contents
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `These are some words.\n\nThey're patched info.\n`
  expect(newContents).toBe(expectedContents)
})

test('patch - able to delete text in a text file with regex as delete value', async () => {
  const updated = await patching.patch(t.context.textFile, {
    delete: new RegExp('some words'),
  })

  // returned the updated object
  expect(updated).toBe(`These are .\n\nThey're very amazing.\n`)

  // file was actually written to with the right contents
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `These are .\n\nThey're very amazing.\n`
  expect(newContents).toBe(expectedContents)
})

test('patch - able to execute multiple file operations', async () => {
  const updated = await patching.patch(
    t.context.textFile,
    {
      delete: new RegExp('some words'),
    },
    {
      replace: new RegExp('very amazing'),
      insert: 'patched info',
    },
  )

  // returned the updated object
  expect(updated).toBe(`These are .\n\nThey're patched info.\n`)

  // file was actually written to with the right contents
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `These are .\n\nThey're patched info.\n`
  expect(newContents).toBe(expectedContents)
})

test('patch - do not make changes that already have been done', async () => {
  const updated = await patching.patch(
    t.context.textFile,
    {
      before: 'some words',
      insert: 'These are ',
    },
    {
      after: "They're ",
      insert: 'very amazing.',
    },
  )

  // returned the updated object
  expect(updated).toBeFalsy()

  // file was actually written to with the right contents
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `These are some words.\n\nThey're very amazing.\n`
  expect(newContents).toBe(expectedContents)
})

test('patch - able to make partial changes', async () => {
  const updated = await patching.patch(
    t.context.textFile,
    {
      before: 'some words',
      insert: 'These are ',
    },
    {
      delete: new RegExp('some words'),
    },
    {
      after: "They're ",
      insert: 'very amazing.',
    },
  )

  // returned the updated object
  expect(updated).toBe(`These are .\n\nThey're very amazing.\n`)

  // file was actually written to with the right contents
  const newContents = await jetpack.read(t.context.textFile, 'utf8')
  const expectedContents = `These are .\n\nThey're very amazing.\n`
  expect(newContents).toBe(expectedContents)
})
