const test = require('ava')
const Runtime = require('./runtime')

test('cannot find a command', async t => {
  const r = new Runtime()
  const context = await r.run('bloo blah')
  t.falsy(context.result)
})

test('is fatally wounded by exceptions', async t => {
  const r = new Runtime()
  r.load(`${__dirname}/../fixtures/good-plugins/throws`)

  // for some reason, t.throws doesn't work on this one ...
  try {
    await r.run('throws throw')
  } catch (e) {
    t.is(e.message, `thrown an error!`)
  }
})
