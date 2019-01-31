import * as path from 'path'
import * as expect from 'expect'
import { filesystem } from './filesystem-tools'

test('isFile', () => {
  expect(filesystem.isFile(__filename)).toBe(true)
  expect(filesystem.isFile(__dirname)).toBe(false)
})

test('isNotFile', () => {
  expect(filesystem.isNotFile(__filename)).toBe(false)
  expect(filesystem.isNotFile(__dirname)).toBe(true)
})

test('isDirectory', () => {
  expect(filesystem.isDirectory(__dirname)).toBe(true)
  expect(filesystem.isDirectory(__filename)).toBe(false)
})

test('isNotDirectory', () => {
  expect(filesystem.isNotDirectory(__dirname)).toBe(false)
  expect(filesystem.isNotDirectory(__filename)).toBe(true)
})

test('subdirectories', () => {
  const dirs = filesystem.subdirectories(`${__dirname}/..`)
  expect(dirs.length).toBe(8)
  expect(dirs).toContain(path.join(__dirname, '..', 'toolbox'))
})

test('blank subdirectories', () => {
  expect(filesystem.subdirectories('')).toEqual([])
  expect(filesystem.subdirectories(__filename)).toEqual([])
})

test('relative subdirectories', () => {
  const dirs = filesystem.subdirectories(`${__dirname}/..`, true)
  expect(dirs.length).toBe(8)
  expect(dirs).toContain(`toolbox`)
})

test('filtered subdirectories', () => {
  const dirs = filesystem.subdirectories(`${__dirname}/..`, true, 'to*')
  expect(1).toBe(dirs.length)
  expect(dirs).toContain(`toolbox`)
})

test('path separator', () => {
  const sep = filesystem.separator
  expect(sep).toBe(require('path').sep)
  expect(['/', '\\']).toContain(sep)
})
