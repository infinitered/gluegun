const test = require('ava')
const load = require('../../src/loaders/toml-plugin-loader')
const { find, propEq } = require('ramda')

test('deals with wierd input', t => {
  const plugin = load()
  t.falsy(plugin.run)
  t.is(plugin.loadState, 'error')
  t.is(plugin.errorState, 'input')
})

test('directory not found', t => {
  const plugin = load(`${__dirname}/gonebabygone`)
  t.is(plugin.loadState, 'error')
  t.is(plugin.errorState, 'missingdir')
})

test('missing config files is fine', t => {
  const plugin = load(`${__dirname}/../fixtures/good-plugins/empty`)
  t.is(plugin.loadState, 'ok')
  t.is(plugin.errorState, 'none')
  t.deepEqual(plugin.commands, [])
  t.deepEqual(plugin.extensions, [])
})

test('default name', t => {
  const plugin = load(`${__dirname}/../fixtures/good-plugins/missing-name`)
  t.is(plugin.loadState, 'ok')
  t.is(plugin.errorState, 'none')
  t.is(plugin.name, 'missing-name')
})

test('sane defaults', t => {
  const dir = `${__dirname}/../fixtures/good-plugins/simplest`
  const plugin = load(dir)

  t.is(plugin.loadState, 'ok')
  t.is(plugin.errorState, 'none')
  t.is(plugin.name, 'simplest')
  t.is(plugin.directory, dir)
  t.falsy(plugin.errorMessage)
  t.deepEqual(plugin.extensions, [])
  t.deepEqual(plugin.commands, [])
  t.deepEqual(plugin.defaults, {})
})

test('loads commands', async t => {
  const dir = `${__dirname}/../fixtures/good-plugins/threepack`
  const plugin = load(dir)

  t.falsy(plugin.exception && plugin.exception.message)
  t.is(plugin.errorState, 'none')
  t.is(plugin.loadState, 'ok')
  t.is(plugin.name, '3pack')
  t.is(plugin.directory, dir)
  t.falsy(plugin.errorMessage)
  t.is(plugin.commands.length, 3)
  t.deepEqual(plugin.defaults, { numbers: 3 })

  const two = find(propEq('name', 'two'), plugin.commands)
  t.is(two.name, 'two')
  t.is(two.file, `${dir}/commands/two.js`)
  t.is(typeof two.run, 'function')
  t.is(await two.run(), 'two')
  t.false(plugin.commands[0].hidden)
  t.false(plugin.commands[1].hidden)
  t.false(plugin.commands[2].hidden)
})

test('load commands with front matter', async t => {
  const dir = `${__dirname}/../fixtures/good-plugins/front-matter`
  const plugin = load(dir)

  t.is(plugin.loadState, 'ok')
  t.is(plugin.errorState, 'none')
  t.is(plugin.commands.length, 1)

  // test the command
  const full = find(propEq('name', 'full'), plugin.commands)
  t.is(full.name, 'full')
  t.is(full.file, `${dir}/commands/full.js`)
  t.is(typeof full.run, 'function')
  t.is(await full.run(), 123)
})

test('loads extensions with front matter', async t => {
  const dir = `${__dirname}/../fixtures/good-plugins/front-matter`
  const plugin = load(dir)

  // test the extension
  t.is(plugin.extensions.length, 1)
  const ext = plugin.extensions[0]
  t.is(ext.name, 'hello')
  t.is(typeof ext.setup, 'function')
  const live = ext.setup()
  t.truthy(live)
  t.is(live.very, 'little')
})

test('names default to the filename', async t => {
  const plugin = load(`${__dirname}/../fixtures/good-plugins/auto-detect`)
  t.is(plugin.commands[0].name, 'detectCommand')
  t.is(plugin.extensions[0].name, 'detectExtension')
})

test('plugin names can be overridden', async t => {
  const plugin = load(`${__dirname}/../fixtures/good-plugins/auto-detect`, { name: 'override' })
  t.is(plugin.name, 'override')
})

test('blank names fallback to directory name', t => {
  const plugin = load(`${__dirname}/../fixtures/good-plugins/blank-name`)
  t.is(plugin.name, 'blank-name')
  t.is(plugin.loadState, 'ok')
  t.is(plugin.errorState, 'none')
})

test('supports hidden plugins & commands', t => {
  const dir = `${__dirname}/../fixtures/good-plugins/threepack`
  const plugin = load(dir, { hidden: true })

  t.true(plugin.hidden)
  t.true(plugin.commands[0].hidden)
  t.true(plugin.commands[1].hidden)
  t.true(plugin.commands[2].hidden)
})
