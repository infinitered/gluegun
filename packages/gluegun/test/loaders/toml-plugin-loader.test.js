const test = require('ava')
const load = require('../../src/loaders/toml-plugin-loader')

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
})

test('default namespace', t => {
  const plugin = load(`${__dirname}/../fixtures/bad-plugins/missing-namespace`)
  t.is(plugin.loadState, 'ok')
  t.is(plugin.errorState, 'none')
  t.is(plugin.namespace, 'missing-namespace')
})

test('sane defaults', t => {
  const dir = `${__dirname}/../fixtures/good-plugins/simplest`
  const plugin = load(dir)

  t.is(plugin.loadState, 'ok')
  t.is(plugin.errorState, 'none')
  t.is(plugin.namespace, 'simplest')
  t.is(plugin.directory, dir)
  t.falsy(plugin.errorMessage)
  t.deepEqual(plugin.commands, [])
  t.deepEqual(plugin.defaults, {})
})

test('loads commands', async t => {
  const dir = `${__dirname}/../fixtures/good-plugins/threepack`
  const plugin = load(dir)

  t.falsy(plugin.exception && plugin.exception.message)
  t.is(plugin.errorState, 'none')
  t.is(plugin.loadState, 'ok')
  t.is(plugin.namespace, '3pack')
  t.is(plugin.directory, dir)
  t.falsy(plugin.errorMessage)
  t.is(plugin.commands.length, 3)
  t.deepEqual(plugin.defaults, { numbers: 3 })

  const two = plugin.commands[1]
  t.is(two.name, 'two')
  t.is(two.file, `${dir}/two.js`)
  t.is(two.description, 'Returns a two')
  t.is(typeof two.run, 'function')
  t.is(await two.run(), 'two')
})

test('load from front matter', async t => {
  const dir = `${__dirname}/../fixtures/good-plugins/front-matter`
  const plugin = load(dir)

  t.is(plugin.loadState, 'ok')
  t.is(plugin.errorState, 'none')
  t.is(plugin.commands.length, 1)

  const full = plugin.commands[0]
  t.is(full.name, 'full')
  t.is(full.file, `${dir}/commands/full.js`)
  t.is(full.functionName, 'jimmy')
  t.is(full.description, 'This is the full meal deal.')
  t.is(typeof full.run, 'function')
  t.is(await full.run(), 123)
})
