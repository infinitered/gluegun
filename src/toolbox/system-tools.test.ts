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
