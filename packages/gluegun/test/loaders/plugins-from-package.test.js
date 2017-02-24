const test = require('ava')
const getPluginsFromConfig = require('../../src/loaders/plugins-from-config')

test('wierd input', t => {
  t.deepEqual(getPluginsFromConfig(), [])
  t.deepEqual(getPluginsFromConfig(), [])
})

test('missing toml', t => {
  t.deepEqual(getPluginsFromConfig(''), [])
})

test('not a json file', t => {
  t.deepEqual(getPluginsFromConfig(__dirname), [])
  t.deepEqual(getPluginsFromConfig(__filename), [])
})

test('valid plugins', t => {
  const file = `${__dirname}/../fixtures/good-apps/basic/gluegun.toml`
  const keys = getPluginsFromConfig(file)
  t.deepEqual(keys, ['inapp', 'node_modules/another-pack'])
})
