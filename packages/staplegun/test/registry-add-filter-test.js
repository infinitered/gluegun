import test from 'ava'
import { createRegistry } from '../src/registry'

test('detects filters', t => {
  const r = createRegistry()
  const plugin = r.load(`${__dirname}/_registry/_has-filter.js`)

  t.deepEqual(r.invalidPlugins, [])
  t.deepEqual(r.plugins, [plugin])
  t.is(r.filters.length, 1)
  t.is(r.filters[0].plugin, plugin)
  t.is(r.filters[0].name, 'identity')
})

test('prevents duplicate filters', t => {
  const r = createRegistry()
  r.load(`${__dirname}/_registry/_duplicate-filters.js`)
  t.is(r.filters.length, 1)
})

test('filter names must be non-blank', t => {
  const r = createRegistry()
  r.load(`${__dirname}/_registry/_bad-name-filter.js`)
  t.is(r.filters.length, 0)
})

test('filters must be non-blank', t => {
  const r = createRegistry()
  r.load(`${__dirname}/_registry/_missing-function-filter.js`)
  t.is(r.filters.length, 0)
})
