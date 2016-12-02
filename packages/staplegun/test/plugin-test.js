// @flow
import test from 'ava'
import Plugin from '../src/plugin'

test('default state', t => {
  const plugin: Plugin = new Plugin()
  t.truthy(plugin)
  t.is(plugin.loadState, 'none')
  t.is(plugin.errorState, 'none')
  t.falsy(plugin.directory)
  t.falsy(plugin.namespace)
  t.deepEqual(plugin.commands, [])
  t.deepEqual(plugin.config, {})
})

