const test = require('ava')
const Runtime = require('./runtime')

test('can pass arguments', async t => {
  const r = new Runtime()
  r.load(`${__dirname}/../fixtures/good-plugins/args`)
  const { command, parameters } = await r.run('args hello steve kellock', { caps: false })

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
  r.load(`${__dirname}/../fixtures/good-plugins/nested`)
  const { command, parameters } = await r.run('nested t f jamon holmgren', { chocolate: true })

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
