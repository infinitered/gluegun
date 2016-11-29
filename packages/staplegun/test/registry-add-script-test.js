import test from 'ava'
import { createRegistry } from '../src/registry'
import { createLoadedPlugin } from '../src/plugin'

test('detects scripts', t => {
  const r = createRegistry()
  const plugin = createLoadedPlugin(env => {
    env.addScript('identity', x => x)
  })
  r.use(plugin)

  t.deepEqual(r.invalidPlugins, [])
  t.deepEqual(r.plugins, [plugin])
  t.is(r.scripts.length, 1)
  t.is(r.scripts[0].plugin, plugin)
  t.is(r.scripts[0].name, 'identity')
  t.deepEqual(r.scripts[0].config, {})
  t.deepEqual(r.filters, [])
})

test('prevents duplicate scripts', t => {
  const r = createRegistry()
  const plugin = createLoadedPlugin(env => {
    env.addScript('identity', x => x)
    env.addScript('identity', x => x)
  })
  r.use(plugin)

  t.is(r.scripts.length, 1)
})

test('script names must be non-blank', t => {
  const r = createRegistry()
  const plugin = createLoadedPlugin(env => {
    env.addScript('', x => x)
  })
  r.use(plugin)

  t.is(r.scripts.length, 0)
})

test('scripts must be non-blank', t => {
  const r = createRegistry()
  const plugin = createLoadedPlugin(env => {
    env.addScript('hi')
  })
  r.use(plugin)

  t.is(r.scripts.length, 0)
})
