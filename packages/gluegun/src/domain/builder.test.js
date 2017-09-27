const test = require('ava')
const build = require('./builder')

test('the gauntlet', t => {
  const brand = 'test'
  const builder = build()
    .brand(brand)
    // read from a configuration file
    .configFile(`./${brand}.toml`)
    // plugins
    .src(`${__dirname}/../fixtures/good-plugins/threepack`)
    .plugin(`${__dirname}/../fixtures/good-plugins/simplest`)
    .plugins(`${__dirname}/../fixtures/good-plugins`, { hidden: true })
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

  // the the builder
  t.is(builder.brand, 'test')

  const runtime = builder.create()
  t.truthy(runtime)
})
