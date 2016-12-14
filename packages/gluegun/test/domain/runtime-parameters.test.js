const test = require('ava')
const Runtime = require('../../src/domain/runtime')

test('can pass arguments', async t => {
  const r = new Runtime()
  r.load(`${__dirname}/../fixtures/good-plugins/args`)
  const context = await r.run({
    pluginName: 'args',
    rawCommand: 'hello steve kellock',
    options: { caps: false }
  })

  t.is(context.parameters.rawCommand, 'hello steve kellock')
  t.deepEqual(context.parameters.array, ['steve', 'kellock'])
  t.deepEqual(context.parameters.string, 'steve kellock')
  t.deepEqual(context.parameters.options, { caps: false })
})
