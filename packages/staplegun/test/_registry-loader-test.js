import test from 'ava'
import { load } from '../src/registry-loader'

const derp = file => load(`${__dirname}/fixtures/wrong-format/${file}.toml`)

test('handles strange parameters', t => {
  t.throws(() => load())
  t.throws(() => load(null))
  t.throws(() => load(1))
  t.throws(() => load(1.2))
  t.throws(() => load(true))
  t.throws(() => load({}))
  t.throws(() => load([]))
  t.throws(() => load(() => true))
})

test('handles missing file', t => {
  t.throws(() => load('hello.bmp'))
})

test('handles multiple root keys', t => {
  t.throws(() => derp('multiple-root-keys'))
})

test('handles non-object-in-value', t => {
  t.throws(() => derp('non-object-in-value'))
})

test('handles values are empty', t => {
  t.throws(() => derp('values-are-empty'))
})

test('handles non-toml files', t => {
  t.throws(() => derp('not-toml'))
})

test('handles missing plugin key', t => {
  t.throws(() => derp('missing-plugins'))
})

test('handles plugins not an array', t => {
  t.throws(() => derp('plugins-not-array'))
})

test('handles when plugins is not all strings', t => {
  t.throws(() => derp('plugins-has-non-strings'))
})

test('handles when namespace has a space', t => {
  t.throws(() => derp('namespace-has-space'))
})

test('handles when namespaces that are blank', t => {
  t.throws(() => derp('namespace-is-blank'))
})

test('opens a valid toml file', t => {
  const registry = load(`${__dirname}/fixtures/sample/sample.toml`)
  t.is(registry.namespace, 'sample')
})
