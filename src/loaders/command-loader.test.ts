import * as expect from 'expect'
import { Toolbox } from '../domain/toolbox'
import { loadCommandFromFile, loadCommandFromPreload } from './command-loader'

test('loading from a missing file', async () => {
  await expect(() => loadCommandFromFile('foo.js')).toThrowError(
    "Error: couldn't load command (this isn't a file): foo.js",
  )
})

test('deals with weird input', async () => {
  await expect(() => loadCommandFromFile('')).toThrowError("Error: couldn't load command (file is blank): ")
})

test('open a weird js file', async () => {
  const file = `${__dirname}/../fixtures/bad-modules/text.js`
  await expect(() => loadCommandFromFile(file)).toThrowError(`hello is not defined`)
})

test('default but no run property exported', async () => {
  const file = `${__dirname}/../fixtures/good-modules/module-exports-object.js`
  await expect(() => loadCommandFromFile(file)).toThrowError(
    `Error: Couldn't load command module-exports-object -- needs a "run" property with a function.`,
  )
})

test('fat arrows', async () => {
  const file = `${__dirname}/../fixtures/good-modules/module-exports-fat-arrow-fn.js`
  await expect(() => loadCommandFromFile(file)).not.toThrow()
})

test('load command from preload', async () => {
  const command = loadCommandFromPreload({
    name: 'hello',
    description: 'yiss dream',
    alias: ['z'],
    dashed: true,
    run: toolbox => 'ran!',
  })

  expect(command.name).toBe('hello')
  expect(command.description).toBe('yiss dream')
  expect(command.hidden).toBe(false)
  expect(command.alias).toEqual(['z'])
  expect(command.run(new Toolbox())).toBe('ran!')
  expect(command.file).toBe(null)
  expect(command.dashed).toBe(true)
  expect(command.commandPath).toEqual(['hello'])
})
