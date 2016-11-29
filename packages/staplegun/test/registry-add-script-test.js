import test from 'ava'
import { createRegistry } from '../src/registry'

test('detects scripts', t => {
  const r = createRegistry()
  const plugin = r.load(`${__dirname}/_registry/_has-script.js`)

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
  r.load(`${__dirname}/_registry/_duplicate-scripts.js`)
  t.is(r.scripts.length, 1)
})

test('script names must be non-blank', t => {
  const r = createRegistry()
  r.load(`${__dirname}/_registry/_bad-name-script.js`)
  t.is(r.scripts.length, 0)
})

test('scripts must be non-blank', t => {
  const r = createRegistry()
  r.load(`${__dirname}/_registry/_missing-function-script.js`)
  t.is(r.scripts.length, 0)
})
