import test from 'ava'
import { Runtime } from './runtime'

test('cannot find a command', async t => {
  const r = new Runtime()
  r.addCoreExtensions()
  const toolbox = await r.run('bloo blah')
  t.falsy(toolbox.result)
})

test('is fatally wounded by exceptions', async t => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/throws`)

  // for some reason, t.throws doesn't work on this one ...
  try {
    await r.run('throw')
  } catch (e) {
    t.is(e.message, `thrown an error!`)
  }
})
