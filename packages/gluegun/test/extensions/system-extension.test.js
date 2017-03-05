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

test('knows about which', t => {
  const npm = system.which('npm')
  t.truthy(npm)
})

test('can check if a file/directory exists', t => {
  const folderExist = system.exists(process.cwd())
  t.is(folderExist, 'directory')
  const fileExist = system.exists(process.cwd() + '/package.json')
  t.is(fileExist, 'file')
  const nothingExist = system.exists('./lolno.exe')
  t.falsy(nothingExist)
})
