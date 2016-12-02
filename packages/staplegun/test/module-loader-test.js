import test from 'ava'
import loadModule from '../src/module-loader'
import { keys } from 'ramda'

test('handles weird input', t => {
  t.throws(() => loadModule())
  t.throws(() => loadModule(''))
  t.throws(() => loadModule(1))
  t.throws(() => loadModule(1.1))
  t.throws(() => loadModule(true))
  t.throws(() => loadModule(false))
  t.throws(() => loadModule([]))
  t.throws(() => loadModule({}))
  t.throws(() => loadModule(() => {}))
})

test('detects missing file', t => {
  t.throws(() => loadModule(`${__dirname}/fixtures/bad-modules/missing.js`))
})

test('detects directory', t => {
  t.throws(() => loadModule(`${__dirname}/fixtures/bad-modules`))
})

test('handles blank files', t => {
  const m = loadModule(`${__dirname}/fixtures/bad-modules/blank.js`)
  t.is(typeof m, 'object')
  t.deepEqual(keys(m), [])
})

test('handles files with just a number', t => {
  const m = loadModule(`${__dirname}/fixtures/bad-modules/number.js`)
  t.is(typeof m, 'object')
  t.deepEqual(keys(m), [])
})

test('handles files with just text', t => {
  t.throws(() => loadModule(`${__dirname}/fixtures/bad-modules/text.js`))
})

test('handles files with an object', t => {
  const m = loadModule(`${__dirname}/fixtures/bad-modules/object.js`)
  t.is(typeof m, 'object')
  t.deepEqual(keys(m), [])
})

test('module.exports = function', t => {
  const m = loadModule(`${__dirname}/fixtures/good-modules/module-exports-function.js`)
  t.is(typeof m, 'function')
  t.is(m(), 'hi')
})

test('module.exports = {}', t => {
  const m = loadModule(`${__dirname}/fixtures/good-modules/module-exports-object.js`)
  t.is(typeof m, 'object')
  t.is(m.hi(), 'hi')
})

test('module.exports fat arrow function', t => {
  const m = loadModule(`${__dirname}/fixtures/good-modules/module-exports-fat-arrow-fn.js`)
  t.is(typeof m, 'function')
  t.is(m(), 'hi')
})

test('export named function', t => {
  const m = loadModule(`${__dirname}/fixtures/good-modules/export-named-function.js`)
  t.is(typeof m, 'object')
  t.is(m.hi(), 'hi')
})

test('export default function', t => {
  const m = loadModule(`${__dirname}/fixtures/good-modules/export-default-function.js`)
  t.is(typeof m, 'object')
  t.is(typeof m.default, 'function')
  t.is(m.default(), 'hi')
})

test('async function', async t => {
  const m = loadModule(`${__dirname}/fixtures/good-modules/async-function.js`)
  t.is(typeof m, 'object')
  t.is(await m.hi(), 'hi')
})

test('deals with dupes', async t => {
  const m = loadModule(`${__dirname}/fixtures/good-modules/async-function.js`)
  const n = loadModule(`${__dirname}/fixtures/good-modules/../good-modules/async-function.js`)
  t.is(m, n)
})
