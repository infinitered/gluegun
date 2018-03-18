import * as expect from 'expect'
import { startsWith } from 'ramdasauce'
import { Runtime } from '../runtime/runtime'

const createRuntime = () => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/generate`)
  return r
}

test('generates a simple file', async () => {
  const toolbox = await createRuntime().run('simple')

  expect(toolbox.result).toBe('simple file\n')
})

test('supports props', async () => {
  const toolbox = await createRuntime().run('props Greetings_and_salutations', {
    stars: 5,
  })

  expect(toolbox.result).toBe(`greetingsAndSalutations world
red
green
blue
*****
`)
})

test('detects missing templates', async () => {
  try {
    await createRuntime().run('missing')
  } catch (e) {
    expect(startsWith('template not found', e.message)).toBe(true)
  }
})

test('supports directories', async () => {
  const toolbox = await createRuntime().run('special location')

  expect(toolbox.result).toBe(`location
`)
})
