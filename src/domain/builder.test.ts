import * as expect from 'expect'
import { build } from './builder'
import { Toolbox } from './toolbox'

test('the gauntlet', () => {
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
    .checkForUpdates(0) // don't actually check, but run the command

  const runtime = builder.create()
  expect(runtime).toBeTruthy()

  expect(runtime.brand).toBe('test')
  expect(runtime.commands.length).toBe(34)
  expect(runtime.extensions.length).toBe(16)
  expect(runtime.defaultPlugin.commands.length).toBe(6)

  const { commands } = runtime.defaultPlugin

  expect(commands[0].name).toBe('one')
  expect(commands[1].name).toBe('three')
  expect(commands[2].name).toBe('two')
  expect(commands[3].name).toBe('test')
  expect(commands[4].name).toBe('help')
  expect(commands[5].name).toBe('gimmedatversion')
  expect(commands[5].run(new Toolbox())).toBe('it works')

  expect(runtime.plugins.length).toBe(18)
})
