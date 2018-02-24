import test from 'ava'
import { Command } from '../domain/command'
import { Plugin } from '../domain/plugin'
import { Toolbox } from '../domain/toolbox'
import { Runtime } from '../runtime/runtime'
import { commandInfo } from './meta-tools'

test('commandInfo', t => {
  const fakeContext = new Toolbox()
  const fakeCommand = new Command()
  const fakePlugin = new Plugin()

  fakeContext.runtime = new Runtime()
  fakeContext.runtime.addCoreExtensions()

  fakeCommand.name = 'foo'
  fakeCommand.description = 'foo is a command'
  fakeCommand.commandPath = ['foo']
  fakeCommand.alias = ['f']
  fakeCommand.plugin = fakePlugin

  fakePlugin.commands = [fakeCommand]

  fakeContext.runtime.plugins = [fakePlugin]
  fakeContext.runtime.commands = [fakeCommand]

  const info = commandInfo(fakeContext)
  t.deepEqual(info, [['foo (f)', 'foo is a command']])
})
