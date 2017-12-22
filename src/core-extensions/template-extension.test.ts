import test from 'ava'
import { startsWith } from 'ramdasauce'
import Runtime from '../runtime/runtime'

const createRuntime = () => {
  const r = new Runtime()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/generate`)
  return r
}

test('generates a simple file', async t => {
  const context = await createRuntime().run('generate simple')

  t.is(context.result, 'simple file\n')
})

test('supports props', async t => {
  const context = await createRuntime().run('generate props Greetings_and_salutations', {
    stars: 5,
  })

  t.is(
    context.result,
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
    await createRuntime().run('generate missing')
  } catch (e) {
    t.true(startsWith('template not found', e.message))
  }
})

test('supports directories', async t => {
  const context = await createRuntime().run('generate special location')

  t.is(
    context.result,
    `location
`,
  )
})
