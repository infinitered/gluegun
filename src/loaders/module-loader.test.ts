import * as expect from 'expect'
import { loadModule } from './module-loader'

test('handles weird input', () => {
  expect(() => loadModule('')).toThrow()
  expect(() => loadModule(1)).toThrow()
  expect(() => loadModule(1.1)).toThrow()
  expect(() => loadModule(true)).toThrow()
  expect(() => loadModule(false)).toThrow()
  expect(() => loadModule([])).toThrow()
  expect(() => loadModule({})).toThrow()
  expect(() => loadModule(() => null)).toThrow()
})

test('detects missing file', () => {
  expect(() => loadModule(`${__dirname}/../fixtures/bad-modules/missing.js`)).toThrow()
})

test('detects directory', () => {
  expect(() => loadModule(`${__dirname}/../fixtures/bad-modules`)).toThrow()
})

test('handles blank files', () => {
  const m = loadModule(`${__dirname}/../fixtures/bad-modules/blank.js`)
  expect(typeof m).toBe('object')
  expect(Object.keys(m)).toEqual([])
})

test('handles files with just a number', () => {
  const m = loadModule(`${__dirname}/../fixtures/bad-modules/number.js`)
  expect(typeof m).toBe('number')
  expect(Object.keys(m)).toEqual([])
})

test('handles files with just text', () => {
  expect(() => loadModule(`${__dirname}/../fixtures/bad-modules/text.js`)).toThrow()
})

test('handles files with an object', () => {
  const m = loadModule(`${__dirname}/../fixtures/bad-modules/object.js`)
  expect(typeof m).toBe('object')
  expect(Object.keys(m)).toEqual([])
})

test('export default function', () => {
  const m = loadModule(`${__dirname}/../fixtures/good-modules/module-exports-function.js`)
  expect(typeof m).toBe('function')
  expect(m()).toBe('hi')
})

test('export default {}', async () => {
  const m = loadModule(`${__dirname}/../fixtures/good-modules/module-exports-object.js`)
  expect(typeof m).toBe('object')
  expect(await m.hi()).toBe('hi')
})

test('module.exports fat arrow function', () => {
  const m = loadModule(`${__dirname}/../fixtures/good-modules/module-exports-fat-arrow-fn.js`)
  expect(typeof m.run).toBe('function')
  expect(m.run()).toBe('hi')
})

test('async function', async () => {
  const m = loadModule(`${__dirname}/../fixtures/good-modules/async-function.js`)
  expect(typeof m).toBe('object')
  expect(await m.hi()).toBe('hi')
})

test('deals with dupes', async () => {
  const m = loadModule(`${__dirname}/../fixtures/good-modules/async-function.js`)
  const n = loadModule(`${__dirname}/../fixtures/good-modules/../good-modules/async-function.js`)
  expect(m).toBe(n)
})
