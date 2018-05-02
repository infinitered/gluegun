import * as expect from 'expect'
import { Runtime } from './runtime'

test('can pass arguments', async () => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/args`)
  const { command, parameters } = await r.run('hello steve kellock', { caps: false })

  expect(parameters.string).toBe('steve kellock')
  expect(parameters.first).toBe('steve')
  expect(parameters.second).toBe('kellock')
  expect(parameters.command).toBe('hello')
  expect(parameters.plugin).toBe('args')
  expect(parameters.string).toBe('steve kellock')
  expect(parameters.array).toEqual(['steve', 'kellock'])
  expect(parameters.options).toEqual({ caps: false })
  expect(command.commandPath).toEqual(['hello'])
})

test('can pass arguments, even with nested alias', async () => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/nested`)
  const { command, parameters } = await r.run('t f jamon holmgren', { chocolate: true })

  expect(parameters.string).toBe('jamon holmgren')
  expect(parameters.first).toBe('jamon')
  expect(parameters.second).toBe('holmgren')
  expect(parameters.command).toBe('foo')
  expect(parameters.plugin).toBe('nested')
  expect(parameters.string).toBe('jamon holmgren')
  expect(parameters.array).toEqual(['jamon', 'holmgren'])
  expect(parameters.options).toEqual({ chocolate: true })
  expect(command.commandPath).toEqual(['thing', 'foo'])
})

test('can pass arguments with mixed options', async () => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/args`)
  const { command, parameters } = await r.run('--chocolate=true --foo -n 1 hello steve kellock')
  expect(command.commandPath).toEqual(['hello'])
  expect(parameters.string).toBe('steve kellock')
  expect(parameters.first).toBe('steve')
  expect(parameters.second).toBe('kellock')
  expect(parameters.command).toBe('hello')
  expect(parameters.options.foo).toBe(true)
  expect(parameters.options.n).toBe(1)
  expect(parameters.options.chocolate).toBe('true')
})

test('properly infers the heirarchy from folder structure', async () => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/nested`)
  const { command, parameters } = await r.run('implied bar thing --foo=1 --force')

  expect(command.commandPath).toEqual(['implied', 'bar'])
  expect(parameters.string).toBe('thing')
  expect(parameters.command).toBe('bar')
  expect(parameters.options.foo).toBe(1)
  expect(parameters.options.force).toBe(true)
})

test('properly assembles parameters when command and first arg have same name', async () => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`)
  const { command, parameters } = await r.run('one one two')

  expect(command.commandPath).toEqual(['one'])
  expect(parameters.string).toBe('one two')
  expect(parameters.command).toBe('one')
  expect(parameters.first).toBe('one')
  expect(parameters.second).toBe('two')
})
