import * as expect from 'expect'
import { Command } from '../domain/command'
import { Plugin } from '../domain/plugin'
import { Toolbox } from '../domain/toolbox'
import { Runtime } from '../runtime/runtime'
import { commandInfo } from './meta-tools'

test('commandInfo', () => {
  const fakeToolbox = new Toolbox()
  const fakeCommand = new Command()
  const fakePlugin = new Plugin()

  fakeToolbox.runtime = new Runtime()
  fakeToolbox.runtime.addCoreExtensions()

  fakeCommand.name = 'foo'
  fakeCommand.description = 'foo is a command'
  fakeCommand.commandPath = ['foo']
  fakeCommand.alias = ['f']
  fakeCommand.plugin = fakePlugin

  fakePlugin.commands = [fakeCommand]

  const runtime = fakeToolbox.runtime as any
  runtime.plugins = [fakePlugin]
  runtime.commands = [fakeCommand]

  const info = commandInfo(fakeToolbox)
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

  const fakeRuntime = fakeContext.runtime as any
  fakeRuntime.plugins = [fakePlugin]
  fakeRuntime.commands = [fakeCommand]

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

  const fakeRuntime = fakeContext.runtime as any
  fakeRuntime.plugins = [fakePlugin]
  fakeRuntime.commands = [fakeCommand]

  const info = commandInfo(fakeContext)
  expect(info).toEqual([['foo bar baz (u)', commandDescription]])
})
