import * as expect from 'expect'
import { print } from './print-tools'
const stripANSI = require('strip-ansi')

// hijack the console
const log = console.log
let spyLogger = []
console.log = (x, y) => spyLogger.push([stripANSI(x), stripANSI(y)])

afterAll(() => {
  spyLogger = []
  console.log = log
})

test('info', () => {
  print.info('info')
  print.warning('warning!')
  print.success('success!!')
  print.error('error...')
  print.debug('debugging...')
  const title = 'there'
  print.debug('hi', title)
  print.fancy('fancyyyyy')
  print.divider()
  print.newline()
  print.table([
    ['liam', '5'],
    ['matthew', '2'],
  ])
  print.table(
    [
      ['liam', '5'],
      ['matthew', '2'],
    ],
    { format: 'markdown' },
  )

  expect(spyLogger).toMatchSnapshot()
})

test('spin', () => {
  expect(typeof print.spin).toBe('function')
  const spinner = print.spin()
  expect(typeof spinner.stop).toBe('function')
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
