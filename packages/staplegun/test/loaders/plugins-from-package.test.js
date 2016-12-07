import test from 'ava'
import getPluginsFromPackage from '../../src/loaders/plugins-from-package'

test('wierd input', t => {
  t.throws(() => getPluginsFromPackage())
  t.throws(() => getPluginsFromPackage(2))
})

test('missing package.json', t => {
  t.throws(() => getPluginsFromPackage(''))
})

test('not a json file', t => {
  t.throws(() => getPluginsFromPackage(__dirname))
  t.throws(() => getPluginsFromPackage(__filename))
})

test('non-existant key', t => {
  const file = `${__dirname}/../fixtures/good-apps/basic/package.json`
  const keys = getPluginsFromPackage(file, 'missing')
  t.deepEqual(keys, [])
})

test('valid plugins', t => {
  const file = `${__dirname}/../fixtures/good-apps/basic/package.json`
  const keys = getPluginsFromPackage(file, 'gluegun')
  t.deepEqual(keys, ['inapp', 'node_modules/another-pack'])
})

