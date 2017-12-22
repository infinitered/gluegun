import test from 'ava'
import Runtime from './runtime'

test('can pass arguments', async t => {
  const r = new Runtime()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/args`)
  const { command, parameters } = await r.run('hello steve kellock', { caps: false })

  t.is(parameters.string, 'steve kellock')
  t.is(parameters.first, 'steve')
  t.is(parameters.second, 'kellock')
  t.is(parameters.command, 'hello')
  t.is(parameters.plugin, 'args')
  t.is(parameters.string, 'steve kellock')
  t.deepEqual(parameters.array, ['steve', 'kellock'])
  t.deepEqual(parameters.options, { caps: false })
  t.deepEqual(command.commandPath, ['hello'])
})

test('can pass arguments, even with nested alias', async t => {
  const r = new Runtime()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/nested`)
  const { command, parameters } = await r.run('t f jamon holmgren', { chocolate: true })

  t.is(parameters.string, 'jamon holmgren')
  t.is(parameters.first, 'jamon')
  t.is(parameters.second, 'holmgren')
  t.is(parameters.command, 'foo')
  t.is(parameters.plugin, 'nested')
  t.is(parameters.string, 'jamon holmgren')
  t.deepEqual(parameters.array, ['jamon', 'holmgren'])
  t.deepEqual(parameters.options, { chocolate: true })
  t.deepEqual(command.commandPath, ['thing', 'foo'])
})

test('can pass arguments with mixed options', async t => {
  const r = new Runtime()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/args`)
  const { command, parameters } = await r.run('--chocolate=true --foo -n 1 hello steve kellock')
  t.deepEqual(command.commandPath, ['hello'])
  t.is(parameters.string, 'steve kellock')
  t.is(parameters.first, 'steve')
  t.is(parameters.second, 'kellock')
  t.is(parameters.command, 'hello')
  t.is(parameters.options.foo, true)
  t.is(parameters.options.n, 1)
  t.is(parameters.options.chocolate, 'true')
})
