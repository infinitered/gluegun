import * as expect from 'expect'
import { Runtime } from './runtime'

test('runs a command', async () => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`)
  const toolbox = await r.run('three')

  expect(toolbox.result).toEqual([1, 2, 3])
})

test('runs an aliased command', async () => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`)
  const toolbox = await r.run('o')

  expect(toolbox.result).toBe(1)
})

test('runs a nested command', async () => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/nested`)
  const toolbox = await r.run('thing foo')
  expect(toolbox.command).toBeTruthy()
  expect(toolbox.command.name).toBe('foo')
  expect(toolbox.command.commandPath).toEqual(['thing', 'foo'])
  expect(toolbox.result).toBe('nested thing foo has run')
})

test('runs a nested command in build folder', async () => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/nested-build`)
  const toolbox = await r.run('thing foo')
  expect(toolbox.command).toBeTruthy()
  expect(toolbox.command.name).toBe('foo')
  expect(toolbox.command.commandPath).toEqual(['thing', 'foo'])
  expect(toolbox.result).toBe('nested thing foo in build folder has run with loaded extension')
})

test('runs a command with no name prop', async () => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/missing-name`)
  const toolbox = await r.run('foo')
  expect(toolbox.command).toBeTruthy()
  expect(toolbox.command.name).toBe('foo')
})
