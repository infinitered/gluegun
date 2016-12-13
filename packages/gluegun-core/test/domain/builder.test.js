const test = require('ava')
const build = require('../../src/domain/builder')

test('the gauntlet', t => {
  const builder = build()
    .brand('test')

    // plugins
    .loadDefault(`${__dirname}/../fixtures/good-plugins/threepack`)
    .load(`${__dirname}/../fixtures/good-plugins/simplest`)
    .loadAll(`${__dirname}/../fixtures/good-plugins`)

    // // events
    // .on('startup', () => {})
    // .on('commandMissing', context => {})
    // .on('pluginMissing', context => {})
    // .on('finished', context => {})

    // // plugin tokens
    // .token('commandName', '@cliCommand')
    // .token('commandDescription', '@cliDescription')
    // .token('extensionName', '@extensionName')

    // // create the runtime
    // .create()

  t.truthy(builder.brand, 'test')
})
