/* global test */

import * as expect from 'expect'
import * as sinon from 'sinon'
import { Toolbox } from '../../domain/toolbox'
import { strings } from '../../toolbox/string-tools'
import command from './new'

sinon.stub(console, 'log')

function createFakeToolbox(): Toolbox {
  const fakeToolbox = new Toolbox()
  fakeToolbox.strings = strings
  fakeToolbox.meta = {
    src: '',
    version: sinon.stub(),
    packageJSON: sinon.stub(),
    checkForUpdate: sinon.stub(),
    commandInfo: sinon.stub(),
  }
  fakeToolbox.filesystem = {
    resolve: sinon.stub(),
    dir: sinon.stub(),
    chmodSync: sinon.stub(),
    rename: sinon.stub(),
    exists: sinon.stub(),
  } as any
  fakeToolbox.system = {
    spawn: sinon.stub(),
    which: sinon.stub(),
  } as any
  fakeToolbox.prompt = {
    ask: async () => ({ answer: undefined }),
    confirm: sinon.stub(),
    separator: sinon.stub(),
  } as any
  fakeToolbox.template = { generate: sinon.stub() }
  fakeToolbox.print = {
    colors: {
      green: sinon.stub(),
      gray: sinon.stub(),
    },
    info: sinon.stub(),
    error: sinon.stub(),
  } as any
  fakeToolbox.parameters = { first: null, options: {} }
  return fakeToolbox
}

test('has the right interface', () => {
  expect(command.name).toBe('new')
  expect(command.description).toBe('Creates a new gluegun cli')
  expect(command.hidden).toBe(false)
  expect(command.alias).toEqual(['n', 'create'])
  expect(typeof command.run).toBe('function')
})

test('name is required', async () => {
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = null
  await command.run(toolbox)
  const { error } = toolbox.print
  expect((error as sinon.SinonStub).getCall(0).args[0]).toBe('You must provide a valid CLI name.')
  expect((error as sinon.SinonStub).getCall(1).args[0]).toBe('Example: gluegun new movies')
})

test('name cannot be blank', async () => {
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = ''
  await command.run(toolbox)
  const { error } = toolbox.print
  expect((error as sinon.SinonStub).getCall(0).args).toEqual(['You must provide a valid CLI name.'])
  expect((error as sinon.SinonStub).getCall(1).args).toEqual(['Example: gluegun new movies'])
})

test('name must pass regex', async () => {
  const toolbox = createFakeToolbox()
  const name = 'O M G'
  toolbox.parameters.first = name
  await command.run(toolbox)
  const { error } = toolbox.print
  expect((error as sinon.SinonStub).getCall(0).args).toEqual([
    `${name} is not a valid name. Use lower-case and dashes only.`,
  ])
  expect((error as sinon.SinonStub).getCall(1).args).toEqual([`Suggested: gluegun new ${strings.kebabCase(name)}`])
})

test('generates properly', async () => {
  const name = 'foo'
  const language = 'javascript'
  const extension = 'js'
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = name
  toolbox.parameters.options.javascript = true

  // here we run the command
  const result = await command.run(toolbox)

  // setup some conveniences so we don't have giant lines
  const { dir, chmodSync } = toolbox.filesystem
  const { generate } = toolbox.template
  const { spawn } = toolbox.system
  const props = { name, language, extension }

  // assure that the directory was created
  expect((dir as sinon.SinonStub).firstCall.args[0]).toBe(name)

  // tracks the number of files generated
  let i = 0

  // the executable file
  expect((generate as sinon.SinonStub).getCall(i++).args[0]).toEqual({
    template: `cli/bin/cli-executable.ejs`,
    target: `./${name}/bin/${name}`,
    props,
  })

  const DEFAULT_FILES = [
    ['__tests__/cli-integration.test.js.ejs', '__tests__/cli-integration.test.js'],
    ['docs/commands.md.ejs', 'docs/commands.md'],
    ['docs/plugins.md.ejs', 'docs/plugins.md'],
    ['src/commands/generate.js.ejs', 'src/commands/generate.js'],
    ['src/commands/default.js.ejs', 'src/commands/default.js'],
    ['src/extensions/cli-extension.js.ejs', 'src/extensions/cli-extension.js'],
    ['src/templates/model.js.ejs.ejs', 'src/templates/model.js.ejs'],
    ['src/cli.js.ejs', 'src/cli.js'],
    ['LICENSE.ejs', 'LICENSE'],
    ['package.json.ejs', 'package.json'],
    ['readme.md.ejs', 'readme.md'],
    ['.gitignore.ejs', '.gitignore'],
  ]

  // test that each our files get generated
  DEFAULT_FILES.forEach(file => {
    expect((generate as sinon.SinonStub).getCall(i++).args[0]).toEqual({
      template: `cli/${file[0]}`,
      target: `${name}/${file[1]}`,
      props,
    })
  })

  // test permissions
  expect((chmodSync as sinon.SinonStub).firstCall.args).toEqual([`${name}/bin/${name}`, '755'])

  // test package installation
  expect((spawn as sinon.SinonStub).firstCall.args).toEqual([
    `cd ${props.name} && npm install --silent && npm run --quiet format`,
    { shell: true, stdio: 'inherit' },
  ])

  expect(result).toBe(`new ${name}`)
})

test('generates with typescript', async () => {
  const name = 'foo'
  const language = 'typescript'
  const extension = 'ts'
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = name
  toolbox.parameters.options.typescript = true

  // here we run the command
  const result = await command.run(toolbox)

  // setup some conveniences so we don't have giant lines
  const { dir, chmodSync } = toolbox.filesystem
  const { generate } = toolbox.template
  const { spawn } = toolbox.system
  const props = { name, language, extension }

  // assure that the directory was created
  expect((dir as sinon.SinonStub).firstCall.args[0]).toBe(name)

  // tracks the number of files generated
  let i = 0

  // the executable file
  expect((generate as sinon.SinonStub).getCall(i++).args[0]).toEqual({
    template: `cli/bin/cli-executable.ejs`,
    target: `./${name}/bin/${name}`,
    props,
  })

  const DEFAULT_FILES = [
    ['__tests__/cli-integration.test.js.ejs', '__tests__/cli-integration.test.ts'],
    ['docs/commands.md.ejs', 'docs/commands.md'],
    ['docs/plugins.md.ejs', 'docs/plugins.md'],
    ['src/commands/generate.js.ejs', 'src/commands/generate.ts'],
    ['src/commands/default.js.ejs', 'src/commands/default.ts'],
    ['src/extensions/cli-extension.js.ejs', 'src/extensions/cli-extension.ts'],
    ['src/templates/model.js.ejs.ejs', 'src/templates/model.ts.ejs'],
    ['src/cli.js.ejs', 'src/cli.ts'],
    ['LICENSE.ejs', 'LICENSE'],
    ['package.json.ejs', 'package.json'],
    ['readme.md.ejs', 'readme.md'],
    ['.gitignore.ejs', '.gitignore'],
  ]

  // test that each our files get generated
  DEFAULT_FILES.forEach(file => {
    expect((generate as sinon.SinonStub).getCall(i++).args[0]).toEqual({
      template: `cli/${file[0]}`,
      target: `${name}/${file[1]}`,
      props,
    })
  })

  // test permissions
  expect((chmodSync as sinon.SinonStub).firstCall.args).toEqual([`${name}/bin/${name}`, '755'])

  // test package installation
  expect((spawn as sinon.SinonStub).firstCall.args).toEqual([
    `cd ${props.name} && npm install --silent && npm run --quiet format`,
    { shell: true, stdio: 'inherit' },
  ])

  expect(result).toBe(`new ${name}`)
})
