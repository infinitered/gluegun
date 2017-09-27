const test = require('ava')
const Runtime = require('./runtime')

test('can pass arguments', async t => {
  const r = new Runtime()
  r.load(`${__dirname}/../fixtures/good-plugins/args`)
  const context = await r.run('args hello steve kellock', { caps: false })

  t.is(context.parameters.string, 'steve kellock')
  t.deepEqual(context.parameters.command, 'hello')
  t.deepEqual(context.parameters.plugin, 'args')
  t.deepEqual(context.parameters.array, ['steve', 'kellock'])
  t.deepEqual(context.parameters.string, 'steve kellock')
  t.deepEqual(context.parameters.options, { caps: false })
})
