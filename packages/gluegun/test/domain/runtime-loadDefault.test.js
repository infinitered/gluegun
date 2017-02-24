const test = require('ava')
const Runtime = require('../../src/domain/runtime')

test('runs a command explicitly', async t => {
  const r = new Runtime()
  t.falsy(r.defaultPlugin)
  const plugin = r.loadDefault(
    `${__dirname}/../fixtures/good-plugins/threepack`
  )
  t.is(r.defaultPlugin, plugin)
  const context = await r.run({ rawCommand: 'three' })

  t.truthy(context.plugin)
  t.truthy(context.command)
  t.is(context.plugin.name, '3pack')
  t.is(context.command.name, 'three')
  t.deepEqual(context.result, [1, 2, 3])
})

test('runs a command via passed in args', async t => {
  const r = new Runtime()
  t.falsy(r.defaultPlugin)
  const plugin = r.loadDefault(
    `${__dirname}/../fixtures/good-plugins/threepack`
  )
  t.is(r.defaultPlugin, plugin)
  const context = await r.run(['', '', 'three'])
  t.truthy(context.plugin)
  t.truthy(context.command)
  t.is(context.plugin.name, '3pack')
  t.is(context.command.name, 'three')
  t.deepEqual(context.result, [1, 2, 3])
})
