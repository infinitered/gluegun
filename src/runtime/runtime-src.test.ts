import * as expect from 'expect'
import { Runtime } from './runtime'

test('runs a command explicitly', async () => {
  const r = new Runtime()
  r.addCoreExtensions()
  expect(r.defaultPlugin).toBeFalsy()
  r.addDefaultPlugin(`${__dirname}/../fixtures/good-plugins/threepack`)
  expect(r.defaultPlugin).toBeTruthy()
  const toolbox = await r.run('three')

  expect(toolbox.plugin).toBeTruthy()
  expect(toolbox.command).toBeTruthy()
  expect(toolbox.plugin.name).toBe('3pack')
  expect(toolbox.command.name).toBe('three')
  expect(toolbox.result).toEqual([1, 2, 3])
})

test('runs a command via passed in args', async () => {
  const r = new Runtime()
  r.addCoreExtensions()
  expect(r.defaultPlugin).toBeFalsy()
  r.addDefaultPlugin(`${__dirname}/../fixtures/good-plugins/threepack`)
  expect(r.defaultPlugin).toBeTruthy()
  const toolbox = await r.run('three')
  expect(toolbox.plugin).toBeTruthy()
  expect(toolbox.command).toBeTruthy()
  expect(toolbox.plugin.name).toBe('3pack')
  expect(toolbox.command.name).toBe('three')
  expect(toolbox.result).toEqual([1, 2, 3])
})
