import * as expect from 'expect'
import { Toolbox } from '../domain/toolbox'
import printExtension from './print-extension'

const toolbox = new Toolbox()
printExtension(toolbox)

const { print } = toolbox

test('info', () => {
  expect(typeof print.info).toBe('function')
})

test('warning', () => {
  expect(typeof print.warning).toBe('function')
})

test('success', () => {
  expect(typeof print.success).toBe('function')
})

test('error', () => {
  expect(typeof print.error).toBe('function')
})

test('debug', () => {
  expect(typeof print.debug).toBe('function')
})

test('newline', () => {
  expect(typeof print.newline).toBe('function')
})

test('table', () => {
  expect(typeof print.table).toBe('function')
})

test('spin', () => {
  expect(typeof print.spin).toBe('function')
})

test('colors', () => {
  expect(typeof print.colors.highlight).toBe('function')
  expect(typeof print.colors.info).toBe('function')
  expect(typeof print.colors.warning).toBe('function')
  expect(typeof print.colors.success).toBe('function')
  expect(typeof print.colors.error).toBe('function')
  expect(typeof print.colors.line).toBe('function')
  expect(typeof print.colors.muted).toBe('function')
})
