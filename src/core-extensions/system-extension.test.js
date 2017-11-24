const test = require('ava')
const create = require('./system-extension')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const context = {}
create(context)
const system = context.system

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

test.serial('start timer returns the number of milliseconds', async t => {
  const WAIT = 10

  const elapsed = system.startTimer() // start a timer
  await delay(WAIT) // simulate a delay
  const duration = elapsed() // how long was that?

  // due to rounding this can be before the timeout.
  t.true(duration >= WAIT - 1)
})
