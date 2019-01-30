import * as path from 'path'
import * as expect from 'expect'
import { Toolbox } from '../domain/toolbox'
import { loadPluginFromDirectory } from './plugin-loader'

test('deals with weird input', () => {
  expect(() => loadPluginFromDirectory(`${__dirname}/gonebabygone`)).toThrow()
})

test('missing config files is fine', () => {
  const plugin = loadPluginFromDirectory(`${__dirname}/../fixtures/good-plugins/empty`)
  expect(plugin.commands).toEqual([])
  expect(plugin.extensions).toEqual([])
})

test('default name', () => {
  const plugin = loadPluginFromDirectory(`${__dirname}/../fixtures/good-plugins/missing-name`)
  expect(plugin.name).toBe('missing-name')
})

test('sane defaults', () => {
  const dir = `${__dirname}/../fixtures/good-plugins/simplest`
  const plugin = loadPluginFromDirectory(dir)

  expect(plugin.name).toBe('simplest')
  expect(plugin.directory).toBe(dir)
  expect(plugin.extensions).toEqual([])
  expect(plugin.commands).toEqual([])
  expect(plugin.defaults).toEqual({})
})

test('loads commands', async () => {
  const dir = `${__dirname}/../fixtures/good-plugins/threepack`
  const plugin = loadPluginFromDirectory(dir)

  expect(plugin.name).toBe('3pack')
  expect(plugin.directory).toBe(dir)
  expect(plugin.commands.length).toBe(3)
  expect(plugin.defaults).toEqual({ numbers: 3 })

  const two = plugin.commands.find(c => c.name === 'two')
  expect(two.name).toBe('two')
  expect(two.file).toBe(path.join(dir, 'commands', 'two.js'))
  expect(typeof two.run).toBe('function')
  expect(await two.run()).toBe('two')
  expect(plugin.commands[0].hidden).toBeFalsy()
  expect(plugin.commands[1].hidden).toBeFalsy()
  expect(plugin.commands[2].hidden).toBeFalsy()
})

test('load commands with front matter', async () => {
  const dir = `${__dirname}/../fixtures/good-plugins/front-matter`
  const plugin = loadPluginFromDirectory(dir)

  expect(plugin.commands.length).toBe(1)

  // test the command
  const full = plugin.commands.find(c => c.name === 'full')
  expect(full.name).toBe('full')
  expect(full.file).toBe(path.join(dir, 'commands', 'full.js'))
  expect(typeof full.run).toBe('function')
  expect(await full.run()).toBe(123)
})

test('loads extensions with front matter', async () => {
  const toolbox = new Toolbox()

  const dir = `${__dirname}/../fixtures/good-plugins/front-matter`
  const plugin = loadPluginFromDirectory(dir)

  // test the extension
  expect(plugin.extensions.length).toBe(1)
  const ext = plugin.extensions[0]
  expect(ext.name).toBe('hello')
  expect(typeof ext.setup).toBe('function')
  ext.setup(toolbox)
  expect(toolbox.hello).toBeTruthy()
  expect(toolbox.hello.very).toBe('little')
})

test('names default to the filename', async () => {
  const plugin = loadPluginFromDirectory(`${__dirname}/../fixtures/good-plugins/auto-detect`)
  expect(plugin.commands[0].name).toBe('detectCommand')
  expect(plugin.extensions[0].name).toBe('detectExtension')
})

test('plugin names can be overridden', async () => {
  const plugin = loadPluginFromDirectory(`${__dirname}/../fixtures/good-plugins/auto-detect`, {
    name: 'override',
  })
  expect(plugin.name).toBe('override')
})

test('blank names fallback to directory name', () => {
  const plugin = loadPluginFromDirectory(`${__dirname}/../fixtures/good-plugins/blank-name`)
  expect(plugin.name).toBe('blank-name')
})

test('supports hidden plugins & commands', () => {
  const dir = `${__dirname}/../fixtures/good-plugins/threepack`
  const plugin = loadPluginFromDirectory(dir, { hidden: true })

  expect(plugin.hidden).toBe(true)
  expect(plugin.commands[0].hidden).toBe(true)
  expect(plugin.commands[1].hidden).toBe(true)
  expect(plugin.commands[2].hidden).toBe(true)
})

test('ignores test files', () => {
  const dir = `${__dirname}/../fixtures/good-plugins/excluded`
  const plugin = loadPluginFromDirectory(dir)

  expect(plugin.commands.length).toBe(2)
  expect(plugin.commands[0].name).toBe('bar')
  expect(plugin.commands[1].name).toBe('foo')
  expect(plugin.extensions.length).toBe(1)
})
