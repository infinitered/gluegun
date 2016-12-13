const test = require('ava')
const Runtime = require('../../src/domain/runtime')

test('runs a command', async t => {
  const r = new Runtime()
  t.falsy(r.defaultPlugin)
  const plugin = r.loadDefault(`${__dirname}/../fixtures/good-plugins/threepack`)
  t.is(r.defaultPlugin, plugin)
  const context = await r.run({ rawCommand: 'three' })

  t.deepEqual(context.result, [1, 2, 3])
})
