import test from 'ava'
import Command from '../src/command'

test('default state', t => {
  const command: Command = new Command()
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
  const command: Command = new Command()
  command.loadFromFile('foo.js')
  t.falsy(command.run)
  t.is(command.loadState, 'error')
  t.is(command.errorState, 'missing')
})

test('deals with wierd input', t => {
  const command: Command = new Command()
  command.loadFromFile()
  t.falsy(command.run)
  t.is(command.loadState, 'error')
  t.is(command.errorState, 'input')
})

test('default but none exported', t => {
  const command: Command = new Command()
  command.loadFromFile(`${__dirname}/fixtures/good-modules/module-exports-object.js`)
  t.falsy(command.run)
  t.is(command.loadState, 'error')
  t.is(command.errorState, 'badfunction')
})

test('default and got it', t => {
  const command: Command = new Command()
  command.loadFromFile(`${__dirname}/fixtures/good-modules/export-default-function.js`)
  t.is(typeof command.run, 'function')
  t.is(command.loadState, 'ok')
  t.is(command.errorState, 'none')
})

test('named function not there', t => {
  const command: Command = new Command()
  command.loadFromFile(`${__dirname}/fixtures/good-modules/export-named-function.js`, 'lol')
  t.falsy(command.run)
  t.is(command.loadState, 'error')
  t.is(command.errorState, 'badfunction')
})

test('named function was there', t => {
  const command: Command = new Command()
  command.loadFromFile(`${__dirname}/fixtures/good-modules/export-named-function.js`, 'hi')
  t.is(typeof command.run, 'function')
  t.is(command.run.name, 'hi')
  t.is(command.loadState, 'ok')
  t.is(command.errorState, 'none')
})
