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
    t.true(/not found/.test(e.stderr))
  }
})

test('reads and writes the clipboard', t => {
  system.writeToClipboard('hello!')
  const clip = system.readFromClipboard()
  t.is(clip, 'hello!')
})

test('knows about which', t => {
  const npm = system.which('npm')
  t.truthy(npm)
})

test('can spawn and capture results', async t => {
  const good = await system.spawn('echo hello')
  t.is(good.status, 0)
  t.is(good.stdout.toString(), 'hello\n')
})

test('spawn deals with missing programs', async t => {
  const crap = await system.spawn('dfsjkajfkldasjklfajsd')
  t.truthy(crap.error)
  t.falsy(crap.output)
  t.is(crap.status, null)
})

test('spawn deals exit codes', async t => {
  const crap = await system.spawn('npm')
  t.falsy(crap.error)
  t.is(crap.status, 1)
})
