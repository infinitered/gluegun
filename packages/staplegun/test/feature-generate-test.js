import test from 'ava'
import Runtime from '../src/runtime'

const createRuntime = () => {
  const r = new Runtime()
  r.directories.root = 'generated'
  r.addPluginFromDirectory(`${__dirname}/fixtures/good-plugins/generate`)
  return r
}

test('generates a simple file', async t => {
  const context = await createRuntime().run('generate', 'simple')

  t.is(context.result, 'simple file\n')
})

test('supports props', async t => {
  const context = await createRuntime().run('generate', 'props')

  t.falsy(context.error && context.error.message)
  t.is(context.result, 'hello world\nred\ngreen\nblue\n')
})
