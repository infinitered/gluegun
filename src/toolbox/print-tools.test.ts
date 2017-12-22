import test from 'ava'

// hijack the console
const log = console.log

let spyLogger = []
console.log = (x, y) => spyLogger.push([x, y])

// then spy on it
// const spyLog = sinon.spy(console, 'log')

// finally require the print
const print = require('./print-tools')

// test.before(() => null)

test.after.always(() => {
  spyLogger = []
  console.log = log
})

test('info', t => {
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
  print.table([['liam', '5'], ['matthew', '2']])
  print.table([['liam', '5'], ['matthew', '2']], { format: 'markdown' })

  t.snapshot(spyLogger)
})

test('spin', t => {
  t.is(typeof print.spin, 'function')
  const spinner = print.spin()
  t.is(typeof spinner.stop, 'function')
})

test('colors', t => {
  t.is(typeof print.colors.highlight, 'function')
  t.is(typeof print.colors.info, 'function')
  t.is(typeof print.colors.warning, 'function')
  t.is(typeof print.colors.success, 'function')
  t.is(typeof print.colors.error, 'function')
  t.is(typeof print.colors.line, 'function')
  t.is(typeof print.colors.muted, 'function')
})
