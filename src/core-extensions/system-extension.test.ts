import * as expect from 'expect'
import { platform } from 'os'
import { Toolbox } from '../domain/toolbox'
import create from './system-extension'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const toolbox = new Toolbox()
create(toolbox)
const system = toolbox.system

test('survives the factory function', () => {
  expect(system).toBeTruthy()
  expect(typeof system.run).toBe('function')
})

test('captures stdout', async () => {
  const stdout = await system.run(`${platform() === 'win32' ? 'dir /S /B' : 'ls'} ${__filename}`)
  expect(stdout).toContain(__filename)
})

test('captures stderr', async () => {
  expect.assertions(1)
  try {
    await system.run(`omgdontrunlol ${__filename}`)
  } catch (e) {
    expect(/not (found|recognized)/.test(e.stderr)).toBe(true)
  }
})

test('knows about which', () => {
  const npm = system.which('npm')
  expect(npm).toBeTruthy()
})

test('can spawn and capture results', async () => {
  const good = await system.spawn('echo hello')
  expect(good.status).toBe(0)
  expect(good.stdout.toString()).toEqual(expect.stringMatching(/\"?hello\"?\w*/))
})

test('spawn deals with missing programs', async () => {
  const crap = await system.spawn('dfsjkajfkldasjklfajsd')
  expect(crap.error).toBeTruthy()
  expect(crap.output).toBeFalsy()
  expect(crap.status).toBe(null)
})

test('spawn deals exit codes', async () => {
  const crap = await system.spawn('npm')
  expect(crap.error).toBeFalsy()
  expect(crap.status).toBe(1)
})

test('start timer returns the number of milliseconds', async () => {
  const WAIT = 10

  const elapsed = system.startTimer() // start a timer
  await delay(WAIT) // simulate a delay
  const duration = elapsed() // how long was that?

  // due to rounding this can be before the timeout.
  expect(duration >= WAIT - 1).toBe(true)
})
