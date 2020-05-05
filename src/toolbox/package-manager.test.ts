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
    command: 'yarn add infinite_red',
    stdout: undefined,
  })
})

test('add', async () => {
  const result = await packageManager.add('infinite_red', { dryRun: true, dev: true })
  expect(result).toEqual({
    success: true,
    command: 'yarn add --dev infinite_red',
    stdout: undefined,
  })
})

test('add', async () => {
  const result = await packageManager.add('infinite_red', { dryRun: true, dev: true, force: 'npm' })
  expect(result).toEqual({
    success: true,
    command: 'npm install --save-dev infinite_red',
    stdout: undefined,
  })
})

test('remove', async () => {
  const result = await packageManager.remove('infinite_red', { dryRun: true })
  expect(result).toEqual({
    success: true,
    command: 'yarn remove infinite_red',
    stdout: undefined,
  })
})
