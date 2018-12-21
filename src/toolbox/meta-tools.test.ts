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
