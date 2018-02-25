import test from 'ava'
import { build } from './builder'
import { Toolbox } from './toolbox'

test('the gauntlet', t => {
  const builder = build('test')
    // plugins
    .src(`${__dirname}/../fixtures/good-plugins/threepack`)
    .help()
    .version({
      name: 'gimmedatversion',
      alias: ['version', 'v'],
      run: toolbox => 'it works',
    })
    .defaultCommand()
    .plugin(`${__dirname}/../fixtures/good-plugins/simplest`)
    .plugins(`${__dirname}/../fixtures/good-plugins`, { hidden: true })

  const runtime = builder.create()
  t.truthy(runtime)

  t.is(runtime.brand, 'test')
  t.is(runtime.commands.length, 26)
  t.is(runtime.extensions.length, 13)
  t.is(runtime.defaultPlugin.commands.length, 6)

  const { commands } = runtime.defaultPlugin

  t.is(commands[0].name, 'one')
  t.is(commands[1].name, 'three')
  t.is(commands[2].name, 'two')
  t.is(commands[3].name, 'test')
  t.is(commands[4].name, 'help')
  t.is(commands[5].name, 'gimmedatversion')
  t.is(commands[5].run(new Toolbox()), 'it works')

  t.is(runtime.plugins.length, 15)
})
