const test = require('ava')
const build = require('../../src/domain/builder')

test('the gauntlet', t => {
  const builder = build()
    .brand('test')

    // plugins
    .loadDefault(`${__dirname}/../fixtures/good-plugins/threepack`)
    .load(`${__dirname}/../fixtures/good-plugins/simplest`)
    .loadAll(`${__dirname}/../fixtures/good-plugins`)

    // events
    .on('start', () => {})
    .on('pluginLoad', context => {})
    .on('pluginList', context => {})
    .on('pluginError', context => {})
    .on('commandList', context => {})
    .on('commandLoad', context => {})
    .on('commandStart', context => {})
    .on('commandFinish', context => {})
    .on('commandError', context => {})
    .on('runError', context => {})
    .on('finish', context => {})

    // plugin tokens
    .token('commandName', '@cliCommand')
    .token('commandDescription', '@cliDescription')
    .token('extensionName', '@extensionName')

  // the the builder
  t.is(builder.brand, 'test')

  const runtime = builder.createRuntime()
  t.truthy(runtime)
})
