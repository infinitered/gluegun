const test = require('ava')
const Runtime = require('../../src/domain/runtime')

test('can read from config', async t => {
  const r = new Runtime()
  const plugin = r.load(`${__dirname}/../fixtures/good-plugins/args`)
  const context = await r.run({ pluginName: 'args', rawCommand: 'config' })

  t.falsy(plugin.error)
  t.truthy(plugin.defaults)
  t.is(plugin.defaults.color, 'blue')
  t.truthy(context)
  t.is(context.result, 'blue')
})
