import test from 'ava'
import Runtime from '../src/runtime'

test('can pass arguments', async t => {
  const r = new Runtime()
  r.directories.root = 'generated'
  r.addPluginFromDirectory(`${__dirname}/fixtures/good-plugins/generate`)
  const context = await r.run('generate', 'simple')

  t.truthy(context)
  t.falsy(context.error && context.error.message)
  t.is(context.result, 'simple file\n')
})
