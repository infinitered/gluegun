const test = require('ava')
const Runtime = require('./runtime')

test('can pass arguments', async t => {
  const r = new Runtime()
  r.load(`${__dirname}/../fixtures/good-plugins/args`)
  const context = await r.run('args hello steve kellock', { caps: false })

  t.is('steve kellock', context.parameters.string)
  t.is('steve', context.parameters.first)
  t.is('kellock', context.parameters.second)
  t.is('hello', context.parameters.command)
  t.is('args', context.parameters.plugin)
  t.deepEqual(['steve', 'kellock'], context.parameters.array)
  t.is('steve kellock', context.parameters.string)
  t.deepEqual({ caps: false }, context.parameters.options)
})

test('can pass arguments, even with nested alias', async t => {
  const r = new Runtime()
  r.load(`${__dirname}/../fixtures/good-plugins/nested`)
  const context = await r.run('nested t f jamon holmgren', { chocolate: true })

  t.is('jamon holmgren', context.parameters.string)
  t.is('jamon', context.parameters.first)
  t.is('holmgren', context.parameters.second)
  t.is('foo', context.parameters.command)
  t.is('nested', context.parameters.plugin)
  t.deepEqual(['thing', 'foo'], context.command.commandPath)
  t.deepEqual(['jamon', 'holmgren'], context.parameters.array)
  t.is('jamon holmgren', context.parameters.string)
  t.deepEqual({ chocolate: true }, context.parameters.options)
})
