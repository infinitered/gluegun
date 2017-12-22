import test from 'ava'
import Runtime from './runtime'

test('runs a command explicitly', async t => {
  const r = new Runtime()
  t.falsy(r.defaultPlugin)
  r.addDefaultPlugin(`${__dirname}/../fixtures/good-plugins/threepack`)
  t.truthy(r.defaultPlugin)
  const context = await r.run('3pack three')

  t.truthy(context.plugin)
  t.truthy(context.command)
  t.is(context.plugin.name, '3pack')
  t.is(context.command.name, 'three')
  t.deepEqual(context.result, [1, 2, 3])
})

test('runs a command via passed in args', async t => {
  const r = new Runtime()
  t.falsy(r.defaultPlugin)
  r.addDefaultPlugin(`${__dirname}/../fixtures/good-plugins/threepack`)
  t.truthy(r.defaultPlugin)
  const context = await r.run('3pack three')
  t.truthy(context.plugin)
  t.truthy(context.command)
  t.is(context.plugin.name, '3pack')
  t.is(context.command.name, 'three')
  t.deepEqual(context.result, [1, 2, 3])
})
