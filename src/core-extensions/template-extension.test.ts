import test from 'ava'
import { startsWith } from 'ramdasauce'
import { Runtime } from '../runtime/runtime'

const createRuntime = () => {
  const r = new Runtime()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/generate`)
  return r
}

test('generates a simple file', async t => {
  const toolbox = await createRuntime().run('simple')

  t.is(toolbox.result, 'simple file\n')
})

test('supports props', async t => {
  const toolbox = await createRuntime().run('props Greetings_and_salutations', {
    stars: 5,
  })

  t.is(
    toolbox.result,
    `greetingsAndSalutations world
red
green
blue
*****
`,
  )
})

test('detects missing templates', async t => {
  try {
    await createRuntime().run('missing')
  } catch (e) {
    t.true(startsWith('template not found', e.message))
  }
})

test('supports directories', async t => {
  const toolbox = await createRuntime().run('special location')

  t.is(
    toolbox.result,
    `location
`,
  )
})
