import test from 'ava'
import { createRegistry } from '../src/registry'
import { createLoadedPlugin } from '../src/plugin'

test('detects commands', t => {
  const r = createRegistry()
  const plugin = createLoadedPlugin(env => {
    env.addCommand('identity', x => x)
  })
  r.use(plugin)

  t.deepEqual(r.invalidPlugins, [])
  t.deepEqual(r.plugins, [plugin])
  t.is(r.commands.length, 1)
  t.is(r.commands[0].plugin, plugin)
  t.is(r.commands[0].name, 'identity')
})

test('prevents duplicate commands', t => {
  const r = createRegistry()
  const plugin = createLoadedPlugin(env => {
    env.addCommand('identity', x => x)
    env.addCommand('identity', x => x)
  })
  r.use(plugin)

  t.is(r.commands.length, 1)
})

test('command names must be non-blank', t => {
  const r = createRegistry()
  const plugin = createLoadedPlugin(env => {
    env.addCommand('', x => x)
  })
  r.use(plugin)

  t.is(r.commands.length, 0)
})

test('commands must be non-blank', t => {
  const r = createRegistry()
  const plugin = createLoadedPlugin(env => {
    env.addCommand('hi')
  })
  r.use(plugin)

  t.is(r.commands.length, 0)
})
