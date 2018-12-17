import * as expect from 'expect'
import * as sinon from 'sinon'
import { Toolbox } from '../../domain/toolbox'
import { strings } from '../../toolbox/string-tools'
import command from './new'

sinon.stub(console, 'log')

function createFakeToolbox(): Toolbox {
  const fakeToolbox = new Toolbox()
  fakeToolbox.strings = strings
  fakeToolbox.filesystem = {
    resolve: sinon.stub(),
    dir: sinon.stub(),
    chmodSync: sinon.stub(),
    rename: sinon.stub(),
  }
  fakeToolbox.system = {
    spawn: sinon.stub(),
  }
  fakeToolbox.template = { generate: sinon.stub() }
  fakeToolbox.print = {
    info: sinon.stub(),
    error: sinon.stub(),
  }
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
  expect(error.getCall(0).args[0]).toBe('You must provide a valid CLI name.')
  expect(error.getCall(1).args[0]).toBe('Example: gluegun new foo')
})

test('name cannot be blank', async () => {
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = ''
  await command.run(toolbox)
  const { error } = toolbox.print
  expect(error.getCall(0).args).toEqual(['You must provide a valid CLI name.'])
  expect(error.getCall(1).args).toEqual(['Example: gluegun new foo'])
})

test('name must pass regex', async () => {
  const toolbox = createFakeToolbox()
  const name = 'O M G'
  toolbox.parameters.first = name
  await command.run(toolbox)
  const { error } = toolbox.print
  expect(error.getCall(0).args).toEqual([`${name} is not a valid name. Use lower-case and dashes only.`])
  expect(error.getCall(1).args).toEqual([`Suggested: gluegun new ${strings.kebabCase(name)}`])
})

test('generates properly', async () => {
  const name = 'foo'
  const typescript = undefined
  const extension = 'js'
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = name

  // here we run the command
  const result = await command.run(toolbox)

  // setup some conveniences so we don't have giant lines
  const { dir, chmodSync } = toolbox.filesystem
  const { generate } = toolbox.template
  const { spawn } = toolbox.system
  const props = { name, typescript, extension }

  // assure that the directory was created
  expect(dir.firstCall.args[0]).toBe(name)

  // tracks the number of files generated
  let i = 0

  // the executable file
  expect(generate.getCall(i++).args[0]).toEqual({
    template: `cli/bin/cli-executable.ejs`,
    target: `./${name}/bin/${name}`,
    props,
  })

  const DEFAULT_FILES = [
    ['docs/commands.md.ejs', 'docs/commands.md'],
    ['docs/plugins.md.ejs', 'docs/plugins.md'],
    ['src/commands/generate.js.ejs', 'src/commands/generate.js'],
    ['src/commands/default.js.ejs', 'src/commands/default.js'],
    ['src/extensions/cli-extension.js.ejs', 'src/extensions/cli-extension.js'],
    ['src/templates/model.js.ejs.ejs', 'src/templates/model.js.ejs'],
    ['src/cli.js.ejs', 'src/cli.js'],
    ['LICENSE.ejs', 'LICENSE'],
    ['.prettierrc.ejs', '.prettierrc'],
    ['package.json.ejs', 'package.json'],
    ['readme.md.ejs', 'readme.md'],
    ['.gitignore.ejs', '.gitignore'],
  ]

  // test that each our files get generated
  DEFAULT_FILES.forEach(file => {
    expect(generate.getCall(i++).args[0]).toEqual({
      template: `cli/${file[0]}`,
      target: `${name}/${file[1]}`,
      props,
    })
  })

  // test permissions
  expect(chmodSync.firstCall.args).toEqual([`${name}/bin/${name}`, '755'])

  // test package installation
  expect(spawn.firstCall.args).toEqual([
    `cd ${props.name} && npm install --quiet && npm run --quiet format`,
    { shell: true, stdio: 'inherit', stderr: 'inherit' },
  ])

  expect(result).toBe(`new ${name}`)
})

test('generates with typescript', async () => {
  const name = 'foo'
  const typescript = true
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
  const props = { name, typescript, extension }

  // assure that the directory was created
  expect(dir.firstCall.args[0]).toBe(name)

  // tracks the number of files generated
  let i = 0

  // the executable file
  expect(generate.getCall(i++).args[0]).toEqual({
    template: `cli/bin/cli-executable.ejs`,
    target: `./${name}/bin/${name}`,
    props,
  })

  const DEFAULT_FILES = [
    ['docs/commands.md.ejs', 'docs/commands.md'],
    ['docs/plugins.md.ejs', 'docs/plugins.md'],
    ['src/commands/generate.js.ejs', 'src/commands/generate.ts'],
    ['src/commands/default.js.ejs', 'src/commands/default.ts'],
    ['src/extensions/cli-extension.js.ejs', 'src/extensions/cli-extension.ts'],
    ['src/templates/model.js.ejs.ejs', 'src/templates/model.ts.ejs'],
    ['src/cli.js.ejs', 'src/cli.ts'],
    ['LICENSE.ejs', 'LICENSE'],
    ['.prettierrc.ejs', '.prettierrc'],
    ['package.json.ejs', 'package.json'],
    ['readme.md.ejs', 'readme.md'],
    ['.gitignore.ejs', '.gitignore'],
  ]

  // test that each our files get generated
  DEFAULT_FILES.forEach(file => {
    expect(generate.getCall(i++).args[0]).toEqual({
      template: `cli/${file[0]}`,
      target: `${name}/${file[1]}`,
      props,
    })
  })

  // test permissions
  expect(chmodSync.firstCall.args).toEqual([`${name}/bin/${name}`, '755'])

  // test package installation
  expect(spawn.firstCall.args).toEqual([
    `cd ${props.name} && npm install --quiet && npm run --quiet format`,
    { shell: true, stdio: 'inherit', stderr: 'inherit' },
  ])

  expect(result).toBe(`new ${name}`)
})
