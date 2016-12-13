const test = require('ava')
const Runtime = require('../../src/domain/runtime')

test('cannot find a command', async t => {
  const r = new Runtime()
  const context = await r.run({ pluginName: 'bloo', rawCommand: 'blah' })

  t.falsy(context.result)
  t.falsy(context.error)
})

test('survives exceptions', async t => {
  const r = new Runtime()
  r.load(`${__dirname}/../fixtures/good-plugins/throws`)
  const context = await r.run({ pluginName: 'throws', rawCommand: 'throw' })

  t.falsy(context.result)
  t.truthy(context.error)
})
