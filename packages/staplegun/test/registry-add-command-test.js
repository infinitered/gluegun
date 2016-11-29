import test from 'ava'
import { createRegistry } from '../src/registry'

test('detects commands', t => {
  const r = createRegistry()
  const plugin = r.loadPluginFromFile(`${__dirname}/_registry/_has-command.js`)

  t.deepEqual(r.invalidPlugins, [])
  t.deepEqual(r.plugins, [plugin])
  t.is(r.commands.length, 1)
  t.is(r.commands[0].plugin, plugin)
  t.is(r.commands[0].name, 'identity')
})

test('prevents duplicate commands', t => {
  const r = createRegistry()
  r.loadPluginFromFile(`${__dirname}/_registry/_duplicate-commands.js`)
  t.is(r.commands.length, 1)
})

test('command names must be non-blank', t => {
  const r = createRegistry()
  r.loadPluginFromFile(`${__dirname}/_registry/_bad-name-command.js`)
  t.is(r.commands.length, 0)
})

test('commands must be non-blank', t => {
  const r = createRegistry()
  r.loadPluginFromFile(`${__dirname}/_registry/_missing-function-command.js`)
  t.is(r.commands.length, 0)
})
