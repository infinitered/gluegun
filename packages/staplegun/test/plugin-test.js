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
  t.deepEqual(plugin.defaults, {})
})

test('deals with wierd input', t => {
  const plugin: Plugin = new Plugin()
  plugin.loadFromDirectory()
  t.falsy(plugin.run)
  t.is(plugin.loadState, 'error')
  t.is(plugin.errorState, 'input')
})

test('directory not found', t => {
  const plugin = new Plugin()
  plugin.loadFromDirectory('gonebabygone')
  t.is(plugin.loadState, 'error')
  t.is(plugin.errorState, 'missingdir')
})

test('missing package', t => {
  const plugin = new Plugin()
  plugin.loadFromDirectory(`${__dirname}/fixtures/bad-plugins/empty`)
  t.is(plugin.loadState, 'error')
  t.is(plugin.errorState, 'missingpackage')
})

test('missing namespace', t => {
  const plugin = new Plugin()
  plugin.loadFromDirectory(`${__dirname}/fixtures/bad-plugins/missing-namespace`)
  t.is(plugin.loadState, 'error')
  t.is(plugin.errorState, 'namespace')
})

test('sane defaults', t => {
  const plugin = new Plugin()
  const dir = `${__dirname}/fixtures/good-plugins/simplest`
  plugin.loadFromDirectory(dir)

  t.is(plugin.loadState, 'ok')
  t.is(plugin.errorState, 'none')
  t.is(plugin.namespace, 'simplest')
  t.is(plugin.directory, dir)
  t.falsy(plugin.errorMessage)
  t.deepEqual(plugin.commands, [])
  t.deepEqual(plugin.defaults, {})
})

test('loads commands', async t => {
  const plugin = new Plugin()
  const dir = `${__dirname}/fixtures/good-plugins/threepack`
  plugin.loadFromDirectory(dir)

  t.is(plugin.loadState, 'ok')
  t.is(plugin.errorState, 'none')
  t.is(plugin.namespace, '3pack')
  t.is(plugin.directory, dir)
  t.falsy(plugin.errorMessage)
  t.is(plugin.commands.length, 3)
  t.deepEqual(plugin.defaults, { numbers: 3 })

  const two = plugin.commands[1]
  t.is(two.name, 'two')
  t.is(two.file, `${dir}/two.js`)
  t.is(two.functionName, 'omgTwo')
  t.is(two.description, 'Returns a two')
  t.is(typeof two.run, 'function')
  t.is(await two.run(), 'two')
})
