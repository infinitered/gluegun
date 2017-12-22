import test from 'ava'
import Command from '../domain/command'
import Plugin from '../domain/plugin'
import RunContext from '../domain/run-context'
import Runtime from '../runtime/runtime'
import { commandInfo } from './meta-tools'

test('commandInfo', t => {
  const fakeContext = new RunContext()
  fakeContext.runtime = new Runtime()

  const fakeCommand = new Command()
  fakeCommand.name = 'foo'
  fakeCommand.description = 'foo is a command'
  fakeCommand.commandPath = ['foo']
  fakeCommand.alias = ['f']

  const fakePlugin = new Plugin()
  fakePlugin.commands = [fakeCommand]

  fakeContext.runtime.plugins = [fakePlugin]

  const info = commandInfo(fakeContext)
  t.deepEqual(info, [['foo (f)', 'foo is a command']])
})
