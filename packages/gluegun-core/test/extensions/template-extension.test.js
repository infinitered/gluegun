const test = require('ava')
const Runtime = require('../../src/domain/runtime')

const createRuntime = () => {
  const r = new Runtime()
  r.load(`${__dirname}/../fixtures/good-plugins/generate`)
  return r
}

test('generates a simple file', async t => {
  const context = await createRuntime().run({
    pluginName: 'generate',
    rawCommand: 'simple'
  })

  t.is(context.result, 'simple file\n')
})

test('supports props', async t => {
  const context = await createRuntime().run({
    pluginName: 'generate',
    rawCommand: 'props Greetings_and_salutations',
    options: { stars: 5 }
  })

  t.falsy(context.error && context.error.message)
  t.is(context.result, `greetingsAndSalutations world
red
green
blue
*****
`)
})

