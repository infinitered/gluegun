import test from 'ava'
import { createRegistry } from '../src/registry'

test('setups properly', t => {
  const r = createRegistry()

  t.truthy(r.plugins)
  t.truthy(r.filters)
  t.truthy(r.scripts)
  t.is(r.plugins.length, 0)
  t.is(r.filters.length, 0)
  t.is(r.scripts.length, 0)
})

test('survives strange useFromFile parameters', t => {
  const r = createRegistry()

  t.falsy(r.useFromFile(null))
  t.falsy(r.useFromFile(undefined))
  t.falsy(r.useFromFile(1))
  t.falsy(r.useFromFile(0.1))
  t.falsy(r.useFromFile(true))
  t.falsy(r.useFromFile({}))
  t.falsy(r.useFromFile([]))
  t.deepEqual(r.invalidPlugins, [])
  t.deepEqual(r.plugins, [])
  t.deepEqual(r.scripts, [])
  t.deepEqual(r.filters, [])
})

// much of these tests are handled at the plugin loading stage
test('handles bad plugins', t => {
  const r = createRegistry()
  const badPath = `${__dirname}/_registry/_does_not_exist.lol`
  const badPlugin = r.useFromFile(badPath)

  t.deepEqual(r.invalidPlugins, [badPlugin])
  t.deepEqual(r.plugins, [])
  t.deepEqual(r.scripts, [])
  t.deepEqual(r.filters, [])
})

test('loads empty plugins', t => {
  const r = createRegistry()
  const plugin = r.useFromFile(`${__dirname}/_registry/_no-registers.js`)

  t.deepEqual(r.invalidPlugins, [])
  t.deepEqual(r.plugins, [plugin])
  t.deepEqual(r.scripts, [])
  t.deepEqual(r.filters, [])
})

test('silently ignore duplicate plugins', t => {
  const r = createRegistry()
  r.useFromFile(`${__dirname}/_registry/_no-registers.js`)
  r.useFromFile(`${__dirname}/_registry/_no-registers.js`)

  t.deepEqual(r.invalidPlugins, [])
  t.is(r.plugins.length, 1)
})
