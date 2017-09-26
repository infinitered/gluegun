const test = require('ava')
const Runtime = require('./runtime')

test('load a directory', t => {
  const r = new Runtime()
  r.load(`${__dirname}/../fixtures/good-plugins/simplest`)
  r.load(`${__dirname}/../fixtures/good-plugins/threepack`)
  t.is(r.plugins.length, 2)
})

test('hides commands', t => {
  const r = new Runtime()
  r.load(`${__dirname}/../fixtures/good-plugins/threepack`, { hidden: true })
  t.is(r.plugins.length, 1)
  t.true(r.plugins[0].commands[2].hidden)
})

test('doesn\'t allow plugins with broken dirs', async t => {
  const r = new Runtime()
  const error = await t.throws(() => r.load(__filename), Error)
  t.is(error.message, `Error: couldn\'t load plugin (not a directory): ${__filename}`)
})
