const test = require('ava')
const Command = require('../src/command')

test('default state', t => {
  const command = new Command()
  t.truthy(command)
  t.falsy(command.name)
  t.falsy(command.functionName)
  t.falsy(command.file)
  t.falsy(command.description)
  t.falsy(command.run)
  t.is(command.loadState, 'none')
  t.is(command.errorState, 'none')
})

test('loading from a missing file', t => {
  const command = new Command()
  command.loadFromFile('foo.js')
  t.falsy(command.run)
  t.is(command.loadState, 'error')
  t.is(command.errorState, 'missing')
})

test('deals with wierd input', t => {
  const command = new Command()
  command.loadFromFile()
  t.falsy(command.run)
  t.is(command.loadState, 'error')
  t.is(command.errorState, 'input')
})

test('default but none exported', t => {
  const command = new Command()
  command.loadFromFile(`${__dirname}/fixtures/good-modules/module-exports-object.js`)
  t.falsy(command.run)
  t.is(command.loadState, 'error')
  t.is(command.errorState, 'badfunction')
})

test('fat arrows', t => {
  const command = new Command()
  command.loadFromFile(`${__dirname}/fixtures/good-modules/module-exports-fat-arrow-fn.js`)
  t.is(typeof command.run, 'function')
  t.is(command.loadState, 'ok')
  t.is(command.errorState, 'none')
})
