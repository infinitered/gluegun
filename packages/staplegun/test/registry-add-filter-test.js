import test from 'ava'
import { createRegistry } from '../src/registry'
import { createLoadedPlugin } from '../src/plugin'

test('detects filters', t => {
  const r = createRegistry()
  const plugin = createLoadedPlugin(env => {
    env.addFilter('identity', x => x)
  })
  r.use(plugin)

  t.deepEqual(r.invalidPlugins, [])
  t.deepEqual(r.plugins, [plugin])
  t.is(r.filters.length, 1)
  t.is(r.filters[0].plugin, plugin)
  t.is(r.filters[0].name, 'identity')
})

test('prevents duplicate filters', t => {
  const r = createRegistry()
  const plugin = createLoadedPlugin(env => {
    env.addFilter('identity', x => x)
    env.addFilter('identity', x => x)
  })
  r.use(plugin)

  t.is(r.filters.length, 1)
})

test('filter names must be non-blank', t => {
  const r = createRegistry()
  const plugin = createLoadedPlugin(env => {
    env.addFilter('', x => x)
  })
  r.use(plugin)

  t.is(r.filters.length, 0)
})

test('filters must be non-blank', t => {
  const r = createRegistry()
  const plugin = createLoadedPlugin(env => {
    env.addFilter('identity')
  })
  r.use(plugin)

  t.is(r.filters.length, 0)
})
