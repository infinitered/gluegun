const test = require('ava')
const create = require('../../src/core-extensions/system-extension')

const system = create()

test('survives the factory function', t => {
  t.truthy(system)
  t.is(typeof system.run, 'function')
})

test('captures stdout', async t => {
  const stdout = await system.run(`ls ${__filename}`)
  t.is(stdout, `${__filename}\n`)
})

test('captures stderr', async t => {
  t.plan(1)
  try {
    await system.run(`omgdontrunlol ${__filename}`)
  } catch (e) {
    t.is(e.stderr, `/bin/sh: omgdontrunlol: command not found\n`)
  }
})

test('reads and writes the clipboard', t => {
  system.writeToClipboard('hello!')
  const clip = system.readFromClipboard()
  t.is(clip, 'hello!')
})
