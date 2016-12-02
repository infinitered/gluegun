import test from 'ava'
import Runtime from '../src/runtime'

test('loads the runtime', t => {
  const r = new Runtime()
  t.truthy(r)
  t.is(r.plugins.length, 0)
})

test('adds a directory', t => {
  const r = new Runtime()
  r.addPluginFromDirectory(`${__dirname}/fixtures/good-plugins/simplest`)
  r.addPluginFromDirectory(`${__dirname}/fixtures/good-plugins/threepack`)

  t.is(r.plugins.length, 2)
})

test('gets a list of commands', t => {
  const r = new Runtime()
  r.addPluginFromDirectory(`${__dirname}/fixtures/good-plugins/simplest`)
  const p1 = r.addPluginFromDirectory(`${__dirname}/fixtures/good-plugins/threepack`)
  const c0 = p1.commands[0]
  const list = r.listCommands()

  t.is(list.length, 3)
  t.deepEqual(list[0], { plugin: p1.namespace, command: c0.name, description: c0.description })
})

test('runs a command', t => {
  const r = new Runtime()
  r.addPluginFromDirectory(`${__dirname}/fixtures/good-plugins/simplest`)
  r.addPluginFromDirectory(`${__dirname}/fixtures/good-plugins/threepack`)

  const result = r.run('3pack', 'three')
  t.deepEqual(result, [1, 2, 3])
})
