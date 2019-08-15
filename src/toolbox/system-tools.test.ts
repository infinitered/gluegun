import * as expect from 'expect'
import { system } from './system-tools'

test('which - existing package', () => {
  const result = system.which('node')
  expect(result).not.toBe(null)
})

test('which - non-existing package', () => {
  const result = system.which('non-existing-package')
  expect(result).toBe(null)
})

test('run - should reject if the command does not exist', async () => {
  await expect(system.run('non-existing-command')).rejects.toThrowError()
})

test('run - should resolve if the command exists', async () => {
  await expect(system.run('pwd', { trim: true })).resolves.toBe(process.cwd())
})
