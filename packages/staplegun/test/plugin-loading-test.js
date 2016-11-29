import test from 'ava'
import { loadPlugin, loadPluginDirectory } from '../src/plugin'

test('survives insanity', t => {
  t.throws(() => loadPlugin())
  t.throws(() => loadPlugin(null))
  t.throws(() => loadPlugin(1))
  t.throws(() => loadPlugin(0.1))
  t.throws(() => loadPlugin([]))
  t.throws(() => loadPlugin({}))
  t.throws(() => loadPlugin(true))
})

test('knows about missing files', t => {
  const p = loadPlugin(('./omglulz.tga'))
  t.is(p.error, 'Missing')
  t.is(p.status, 'Error')
})

test('knows about corrupt files', t => {
  const p = loadPlugin(`${__dirname}/_plugin_loading/_corrupt.js`)
  t.is(p.error, 'Invalid')
  t.is(p.status, 'Error')
})

test('knows about missing defaults', t => {
  const p = loadPlugin(`${__dirname}/_plugin_loading/_nodefault.js`)
  t.is(p.error, 'Invalid')
  t.is(p.status, 'Error')
})

test('knows about wrong default', t => {
  const p = loadPlugin(`${__dirname}/_plugin_loading/_wrong.js`)
  t.is(p.error, 'Invalid')
  t.is(p.status, 'Error')
})

test('knows about wrong requires', t => {
  const p = loadPlugin(`${__dirname}/_plugin_loading/_bad-require.js`)
  t.is(p.error, 'Invalid')
  t.is(p.status, 'Error')
})

test('loads valid plugins', t => {
  t.truthy(loadPlugin(`${__dirname}/_plugin_loading/_right.js`))
  // dups don't matter at this level
  t.truthy(loadPlugin(`${__dirname}/_plugin_loading/_right.js`))
})

test('deals with crap', t => {
  t.throws(() => loadPluginDirectory())
  t.throws(() => loadPluginDirectory(3))
})

test('knows about missing directory', t => {
  t.throws(() => loadPluginDirectory(`${__dirname}/omgnotthere`))
})

test('empty directories is totes ok', t => {
  t.is(loadPluginDirectory(`${__dirname}/_plugin_loading/_directories/_empty`).length, 0)
})

test('can load multiple files when the whole dir is good', t => {
  t.is(loadPluginDirectory(`${__dirname}/_plugin_loading/_directories/_good`).length, 3)
})
