const test = require('ava')
const sinon = require('sinon')
const stripAnsi = require('strip-ansi')

// couldn't figure out a way to reset the spy on console.log
// for each run... switched to .serial and incrementing.  sorry.  :(
let i = 0

// hijack the console
console.log = x => x

// then spy on it
const spyLog = sinon.spy(console, 'log')

// finally require the print
const print = require('./print')

test.before(() => {})

test.after.always(() => {
  spyLog.reset()
})

test.serial('info', t => {
  print.info('hi')
  t.is(spyLog.args[i++][0], print.colors.reset('hi'))
})

test.serial('warning', t => {
  print.warning('hi')
  t.is(spyLog.args[i++][0], print.colors.yellow('hi'))
})

test.serial('success', t => {
  print.success('hi')
  t.is(spyLog.args[i++][0], print.colors.green('hi'))
})

test.serial('error', t => {
  print.error('hi')
  t.is(spyLog.args[i++][0], print.colors.error('hi'))
})

test.serial('debug with default', t => {
  const topLine = `vvv -----[ DEBUG ]----- vvv`
  const botLine = `^^^ -----[ DEBUG ]----- ^^^`
  print.debug('hi')
  t.is(spyLog.args[i++][0], print.colors.rainbow(topLine))
  t.is(spyLog.args[i++][0], 'hi')
  t.is(spyLog.args[i++][0], print.colors.rainbow(botLine))
})

test.serial('debug with title', t => {
  const title = 'there'
  const topLine = `vvv -----[ ${title} ]----- vvv`
  const botLine = `^^^ -----[ ${title} ]----- ^^^`
  print.debug('hi', title)
  t.is(spyLog.args[i++][0], print.colors.rainbow(topLine))
  t.is(spyLog.args[i++][0], 'hi')
  t.is(spyLog.args[i++][0], print.colors.rainbow(botLine))
})

test.serial('fancy', t => {
  print.fancy('hi')
  t.is(spyLog.args[i++][0], 'hi')
})

test.serial('divider', t => {
  const line = '---------------------------------------------------------------'
  print.divider()
  t.is(spyLog.args[i++][0], print.colors.line(line))
})

test.serial('newline', t => {
  print.newline()
  t.is(spyLog.args[i++][0], '')
})

test.serial('table', t => {
  const data = [['liam', '5'], ['matthew', '2']]
  print.table(data)
  t.is(stripAnsi(spyLog.args[i++][0]), '  liam      5 \n  matthew   2 ')
})

test.serial('markdown table', t => {
  const data = [['liam', '5'], ['matthew', '2']]
  print.table(data, { format: 'markdown' })
  t.is(stripAnsi(spyLog.args[i++][0]), '| liam    | 5 |\n| ------- | - |\n| matthew | 2 |')
})

test.serial('spin', t => {
  t.is(typeof print.spin, 'function')
  const spinner = print.spin()
  t.is(typeof spinner.stop, 'function')
})

test.serial('colors', t => {
  t.is(typeof print.colors.highlight, 'function')
  t.is(typeof print.colors.info, 'function')
  t.is(typeof print.colors.warning, 'function')
  t.is(typeof print.colors.success, 'function')
  t.is(typeof print.colors.error, 'function')
  t.is(typeof print.colors.line, 'function')
  t.is(typeof print.colors.muted, 'function')
})
