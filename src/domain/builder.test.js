const test = require('ava')
const build = require('./builder')

test('the gauntlet', t => {
  const brand = 'test'
  const builder = build()
    .brand(brand)
    // plugins
    .src(`${__dirname}/../fixtures/good-plugins/threepack`)
    .help()
    .version({
      name: 'gimmedatversion',
      alias: ['version', 'v'],
      run: context => 'it works'
    })
    .defaultCommand()
    .plugin(`${__dirname}/../fixtures/good-plugins/simplest`)
    .plugins(`${__dirname}/../fixtures/good-plugins`, { hidden: true })

  // the the builder
  t.is(builder.brand, 'test')

  const runtime = builder.create()
  t.truthy(runtime)

  t.is(runtime.defaultPlugin.commands.length, 6)
  t.is(runtime.defaultPlugin.commands[0].name, 'help')
  t.is(runtime.defaultPlugin.commands[1].name, 'gimmedatversion')
  t.is(runtime.defaultPlugin.commands[1].run(), 'it works')
  t.is(runtime.defaultPlugin.commands[2].name, brand)
})
