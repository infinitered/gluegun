const test = require('ava')
const Plugin = require('./plugin')

test('default state', t => {
  const plugin = new Plugin()
  t.truthy(plugin)
  t.falsy(plugin.directory)
  t.falsy(plugin.name)
  t.is(plugin.hidden, false)
  t.deepEqual(plugin.commands, [])
  t.deepEqual(plugin.extensions, [])
  t.deepEqual(plugin.defaults, {})
})
