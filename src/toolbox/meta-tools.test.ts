import * as expect from 'expect'
import { Command } from '../domain/command'
import { Plugin } from '../domain/plugin'
import { Toolbox } from '../domain/toolbox'
import { Runtime } from '../runtime/runtime'
import { commandInfo } from './meta-tools'

test('commandInfo', () => {
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
  expect(info).toEqual([['foo (f)', 'foo is a command']])
})

test('command name on nested command with name', () => {
  const fakeContext = new Toolbox()
  const fakeCommand = new Command()
  const fakePlugin = new Plugin()
  const commandDescription = 'ubi is a command'

  fakeContext.runtime = new Runtime()
  fakeContext.runtime.addCoreExtensions()

  fakeCommand.name = 'ubi'
  fakeCommand.description = commandDescription
  fakeCommand.commandPath = ['foo', 'bar', 'baz']
  fakeCommand.alias = ['u']
  fakeCommand.plugin = fakePlugin

  fakePlugin.commands = [fakeCommand]

  fakeContext.runtime.plugins = [fakePlugin]
  fakeContext.runtime.commands = [fakeCommand]

  const info = commandInfo(fakeContext)
  expect(info).toEqual([['foo bar ubi (u)', commandDescription]])
})

test('command name on nested command without name', () => {
  const fakeContext = new Toolbox()
  const fakeCommand = new Command()
  const fakePlugin = new Plugin()
  const commandDescription = 'baz is a command'

  fakeContext.runtime = new Runtime()
  fakeContext.runtime.addCoreExtensions()

  fakeCommand.description = commandDescription
  fakeCommand.commandPath = ['foo', 'bar', 'baz']
  fakeCommand.alias = ['u']
  fakeCommand.plugin = fakePlugin

  fakePlugin.commands = [fakeCommand]

  fakeContext.runtime.plugins = [fakePlugin]
  fakeContext.runtime.commands = [fakeCommand]

  const info = commandInfo(fakeContext)
  expect(info).toEqual([['foo bar baz (u)', commandDescription]])
})
