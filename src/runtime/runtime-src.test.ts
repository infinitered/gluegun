import test from 'ava'
import { Runtime } from './runtime'

test('runs a command explicitly', async t => {
  const r = new Runtime()
  t.falsy(r.defaultPlugin)
  r.addDefaultPlugin(`${__dirname}/../fixtures/good-plugins/threepack`)
  t.truthy(r.defaultPlugin)
  const toolbox = await r.run('3pack three')

  t.truthy(toolbox.plugin)
  t.truthy(toolbox.command)
  t.is(toolbox.plugin.name, '3pack')
  t.is(toolbox.command.name, 'three')
  t.deepEqual(toolbox.result, [1, 2, 3])
})

test('runs a command via passed in args', async t => {
  const r = new Runtime()
  t.falsy(r.defaultPlugin)
  r.addDefaultPlugin(`${__dirname}/../fixtures/good-plugins/threepack`)
  t.truthy(r.defaultPlugin)
  const toolbox = await r.run('3pack three')
  t.truthy(toolbox.plugin)
  t.truthy(toolbox.command)
  t.is(toolbox.plugin.name, '3pack')
  t.is(toolbox.command.name, 'three')
  t.deepEqual(toolbox.result, [1, 2, 3])
})
