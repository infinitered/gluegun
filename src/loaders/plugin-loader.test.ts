import test from 'ava'
import { find, propEq } from 'ramda'
import RunContext from '../domain/run-context'
import { loadPluginFromDirectory } from './plugin-loader'

test('deals with weird input', t => {
  t.throws(() => loadPluginFromDirectory(`${__dirname}/gonebabygone`))
})

test('missing config files is fine', t => {
  const plugin = loadPluginFromDirectory(`${__dirname}/../fixtures/good-plugins/empty`)
  t.deepEqual(plugin.commands, [])
  t.deepEqual(plugin.extensions, [])
})

test('default name', t => {
  const plugin = loadPluginFromDirectory(`${__dirname}/../fixtures/good-plugins/missing-name`)
  t.is(plugin.name, 'missing-name')
})

test('sane defaults', t => {
  const dir = `${__dirname}/../fixtures/good-plugins/simplest`
  const plugin = loadPluginFromDirectory(dir)

  t.is(plugin.name, 'simplest')
  t.is(plugin.directory, dir)
  t.deepEqual(plugin.extensions, [])
  t.deepEqual(plugin.commands, [])
  t.deepEqual(plugin.defaults, {})
})

test('loads commands', async t => {
  const dir = `${__dirname}/../fixtures/good-plugins/threepack`
  const plugin = loadPluginFromDirectory(dir)

  t.is(plugin.name, '3pack')
  t.is(plugin.directory, dir)
  t.is(plugin.commands.length, 3)
  t.deepEqual(plugin.defaults, { numbers: 3 })

  const two = find(propEq('name', 'two'), plugin.commands)
  t.is(two.name, 'two')
  t.is(two.file, `${dir}/commands/two.js`)
  t.is(typeof two.run, 'function')
  t.is(await two.run(), 'two')
  t.falsy(plugin.commands[0].hidden)
  t.falsy(plugin.commands[1].hidden)
  t.falsy(plugin.commands[2].hidden)
})

test('load commands with front matter', async t => {
  const dir = `${__dirname}/../fixtures/good-plugins/front-matter`
  const plugin = loadPluginFromDirectory(dir)

  t.is(plugin.commands.length, 1)

  // test the command
  const full = find(propEq('name', 'full'), plugin.commands)
  t.is(full.name, 'full')
  t.is(full.file, `${dir}/commands/full.js`)
  t.is(typeof full.run, 'function')
  t.is(await full.run(), 123)
})

test('loads extensions with front matter', async t => {
  const context = new RunContext()

  const dir = `${__dirname}/../fixtures/good-plugins/front-matter`
  const plugin = loadPluginFromDirectory(dir)

  // test the extension
  t.is(plugin.extensions.length, 1)
  const ext = plugin.extensions[0]
  t.is(ext.name, 'hello')
  t.is(typeof ext.setup, 'function')
  ext.setup(context)
  t.truthy(context.hello)
  t.is(context.hello.very, 'little')
})

test('names default to the filename', async t => {
  const plugin = loadPluginFromDirectory(`${__dirname}/../fixtures/good-plugins/auto-detect`)
  t.is(plugin.commands[0].name, 'detectCommand')
  t.is(plugin.extensions[0].name, 'detectExtension')
})

test('plugin names can be overridden', async t => {
  const plugin = loadPluginFromDirectory(`${__dirname}/../fixtures/good-plugins/auto-detect`, {
    name: 'override',
  })
  t.is(plugin.name, 'override')
})

test('blank names fallback to directory name', t => {
  const plugin = loadPluginFromDirectory(`${__dirname}/../fixtures/good-plugins/blank-name`)
  t.is(plugin.name, 'blank-name')
})

test('supports hidden plugins & commands', t => {
  const dir = `${__dirname}/../fixtures/good-plugins/threepack`
  const plugin = loadPluginFromDirectory(dir, { hidden: true })

  t.true(plugin.hidden)
  t.true(plugin.commands[0].hidden)
  t.true(plugin.commands[1].hidden)
  t.true(plugin.commands[2].hidden)
})

test('ignores test files', t => {
  const dir = `${__dirname}/../fixtures/good-plugins/excluded`
  const plugin = loadPluginFromDirectory(dir)

  t.is(plugin.commands.length, 2)
  t.is(plugin.commands[0].name, 'bar')
  t.is(plugin.commands[1].name, 'foo')
  t.is(plugin.extensions.length, 1)
})
