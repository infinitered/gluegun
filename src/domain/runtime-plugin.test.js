const test = require('ava')
const Runtime = require('./runtime')

const BAD_PLUGIN_PATH = `${__dirname}/../fixtures/does-not-exist`

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

test('silently ignore plugins with broken dirs', async t => {
  const r = new Runtime()
  const error = await r.load(BAD_PLUGIN_PATH)
  t.is(undefined, error)
})

test("throws error if plugin doesn't exist and required: true", async t => {
  const r = new Runtime()
  const error = await t.throws(() => r.load(BAD_PLUGIN_PATH, { required: true }), Error)
  t.is(error.message, `Error: couldn't load plugin (not a directory): ${BAD_PLUGIN_PATH}`)
})
