const test = require('ava')
const getPluginsFromConfig = require('../../src/loaders/plugins-from-config')

test('weird input', t => {
  t.throws(() => getPluginsFromConfig())
})

test('missing toml', t => {
  t.throws(() => getPluginsFromConfig(''))
})

test('not a json file', t => {
  t.throws(() => getPluginsFromConfig(__dirname))
  t.throws(() => getPluginsFromConfig(__filename))
})

test('valid plugins', t => {
  const file = `${__dirname}/../fixtures/good-apps/basic/gluegun.toml`
  const keys = getPluginsFromConfig(file)
  t.deepEqual(keys, ['inapp', 'node_modules/another-pack'])
})
