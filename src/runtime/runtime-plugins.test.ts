import test from 'ava'
import { Runtime } from './runtime'

test('loads all sub-directories', t => {
  const r = new Runtime()
  r.addPlugins(`${__dirname}/../fixtures/good-plugins`)

  t.is(13, r.plugins.length)
})

test('matches sub-directories', t => {
  const r = new Runtime()
  r.addPlugins(`${__dirname}/../fixtures/good-plugins`, { matching: 'blank-*' })
  t.is(1, r.plugins.length)
})

test('hides commands', t => {
  const r = new Runtime()
  r.addPlugins(`${__dirname}/../fixtures/good-plugins`, {
    matching: 'threepack',
    hidden: true,
  })
  t.is(r.plugins.length, 1)
  t.true(r.plugins[0].commands[2].hidden)
})

test('addPlugins ignores bad directories', t => {
  const r = new Runtime()
  r.addPlugins(__filename)
  r.addPlugins(null)
  r.addPlugins(undefined)
  r.addPlugins('')
  t.is(0, r.plugins.length)
})

test('commands and defaultCommand work properly even when multiple plugins are loaded', async t => {
  const r = new Runtime('default-command')
  r.addDefaultPlugin(`${__dirname}/../fixtures/good-plugins/nested`)
  r.addCommand({
    name: 'default-command',
    run: () => null,
  })
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`)

  t.is(2, r.plugins.length)

  let context = await r.run('')

  t.is(context.command.name, 'default-command')

  context = await r.run('one')

  t.is(context.command.name, 'one')
})
