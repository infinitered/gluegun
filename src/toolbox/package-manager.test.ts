import * as expect from 'expect'
import { packageManager } from './package-manager-tools'

test('hasYarn', () => {
  // Tests should always be run with yarn installed
  expect(packageManager.hasYarn()).toBe(true)
})

test('add', async () => {
  const result = await packageManager.add('infinite_red', { dryRun: true })
  expect(result).toEqual({
    success: true,
    command: 'yarn add --cwd . infinite_red',
    stdout: undefined,
  })
})

test('add', async () => {
  const result = await packageManager.add('infinite_red', { dryRun: true, dev: true })
  expect(result).toEqual({
    success: true,
    command: 'yarn add --cwd . --dev infinite_red',
    stdout: undefined,
  })
})

test('add', async () => {
  const result = await packageManager.add('infinite_red', { dryRun: true, dev: true, force: 'npm' })
  expect(result).toEqual({
    success: true,
    command: 'npm install --prefix . --save-dev infinite_red',
    stdout: undefined,
  })
})

test('add', async () => {
  const result = await packageManager.add(['infinite_red', 'infinite_blue'], { dryRun: true })
  expect(result).toEqual({
    success: true,
    command: 'yarn add --cwd . infinite_red infinite_blue',
    stdout: undefined,
  })
})

test('add', async () => {
  const result = await packageManager.add(['infinite_red', 'infinite_blue'], { dryRun: true, dir: 'test' })
  expect(result).toEqual({
    success: true,
    command: 'yarn add --cwd test infinite_red infinite_blue',
    stdout: undefined,
  })
})

test('remove', async () => {
  const result = await packageManager.remove('infinite_red', { dryRun: true })
  expect(result).toEqual({
    success: true,
    command: 'yarn remove --cwd . infinite_red',
    stdout: undefined,
  })
})

test('remove', async () => {
  const result = await packageManager.remove(['infinite_red', 'infinite_blue'], { dryRun: true })
  expect(result).toEqual({
    success: true,
    command: 'yarn remove --cwd . infinite_red infinite_blue',
    stdout: undefined,
  })
})

test('remove', async () => {
  const result = await packageManager.remove(['infinite_red', 'infinite_blue'], { dryRun: true, dir: 'test' })
  expect(result).toEqual({
    success: true,
    command: 'yarn remove --cwd test infinite_red infinite_blue',
    stdout: undefined,
  })
})
