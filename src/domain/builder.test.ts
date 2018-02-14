import test from 'ava'
import { build } from './builder'
import { RunContext } from './run-context'

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
      run: context => 'it works',
    })
    .defaultCommand()
    .plugin(`${__dirname}/../fixtures/good-plugins/simplest`)
    .plugins(`${__dirname}/../fixtures/good-plugins`, { hidden: true })

  // test the builder
  t.is(builder.runtime.brand, 'test')

  const runtime = builder.create()
  t.truthy(runtime)

  t.is(runtime.commands.length, 26)
  t.is(runtime.extensions.length, 13)
  t.is(runtime.defaultPlugin.commands.length, 6)

  t.is(runtime.defaultPlugin.commands[0].name, brand)
  t.is(runtime.defaultPlugin.commands[1].name, 'gimmedatversion')
  t.is(runtime.defaultPlugin.commands[1].run(new RunContext()), 'it works')
  t.is(runtime.defaultPlugin.commands[2].name, 'help')
  t.is(runtime.defaultPlugin.commands[3].name, 'one')
  t.is(runtime.defaultPlugin.commands[4].name, 'three')
  t.is(runtime.defaultPlugin.commands[5].name, 'two')

  t.is(runtime.plugins.length, 15)
})
