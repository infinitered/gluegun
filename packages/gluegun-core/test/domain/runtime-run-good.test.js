const test = require('ava')
const Runtime = require('../../src/domain/runtime')

test('runs a command', async t => {
  const r = new Runtime()
  r.load(`${__dirname}/../fixtures/good-plugins/threepack`)
  const context = await r.run('3pack', 'three')

  t.falsy(context.error)
  t.deepEqual(context.result, [1, 2, 3])
})
