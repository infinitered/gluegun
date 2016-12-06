const test = require('ava')
const loadCommandFromFile = require('../../src/loaders/command-loader')

test('loading from a missing file', t => {
  const command = loadCommandFromFile('foo.js')
  t.falsy(command.run)
  t.falsy(command.exception)
  t.is(command.loadState, 'error')
  t.is(command.errorState, 'missing')
})

test('deals with wierd input', t => {
  const command = loadCommandFromFile()
  t.falsy(command.run)
  t.falsy(command.exception)
  t.is(command.loadState, 'error')
  t.is(command.errorState, 'input')
})

test('open a wierd js file', t => {
  const file = `${__dirname}/../fixtures/bad-modules/text.js`
  const command = loadCommandFromFile(file)
  t.falsy(command.run)
  t.truthy(command.exception)
  t.is(command.loadState, 'error')
  t.is(command.errorState, 'badfile')
})

test('default but none exported', t => {
  const file = `${__dirname}/../fixtures/good-modules/module-exports-object.js`
  const command = loadCommandFromFile(file)
  t.falsy(command.run)
  t.falsy(command.exception)
  t.is(command.loadState, 'error')
  t.is(command.errorState, 'badfunction')
})

test('fat arrows', t => {
  const file = `${__dirname}/../fixtures/good-modules/module-exports-fat-arrow-fn.js`
  const command = loadCommandFromFile(file)
  t.falsy(command.exception)
  t.is(typeof command.run, 'function')
  t.is(command.loadState, 'ok')
  t.is(command.errorState, 'none')
})
