import test from 'ava'
const printExtension = require('./print-extension')

const context: any = {}
printExtension(context)

const { print } = context

test('info', t => {
  t.is(typeof print.info, 'function')
})

test('warning', t => {
  t.is(typeof print.warning, 'function')
})

test('success', t => {
  t.is(typeof print.success, 'function')
})

test('error', t => {
  t.is(typeof print.error, 'function')
})

test('debug', t => {
  t.is(typeof print.debug, 'function')
})

test('newline', t => {
  t.is(typeof print.newline, 'function')
})

test('table', t => {
  t.is(typeof print.table, 'function')
})

test('spin', t => {
  t.is(typeof print.spin, 'function')
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
