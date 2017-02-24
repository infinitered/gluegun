const test = require('ava')
const build = require('../../src/domain/builder')

test('the gauntlet', t => {
  const brand = 'test'
  const builder = build()
    .brand(brand)
    // read from a configuration file
    .configFile(`./${brand}.toml`)
    // plugins
    .loadDefault(`${__dirname}/../fixtures/good-plugins/threepack`)
    .load(`${__dirname}/../fixtures/good-plugins/simplest`)
    .loadAll(`${__dirname}/../fixtures/good-plugins`, { hidden: true })
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
    .token('commandHidden', '@cliHidden')
    .token('commandAlias', '@cliAlias')
    .token('extensionName', '@extensionName')

  // the the builder
  t.is(builder.brand, 'test')

  const runtime = builder.createRuntime()
  t.truthy(runtime)
})
