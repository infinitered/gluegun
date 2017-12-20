const test = require('ava')
const sinon = require('sinon')
const command = require('./new')
const strings = require('../../utils/string-utils')
sinon.stub(console, 'log')

const createContext = () => ({
  strings,
  filesystem: {
    resolve: sinon.stub(),
    dir: sinon.stub(),
    chmodSync: sinon.stub(),
    rename: sinon.stub()
  },
  system: {
    spawn: sinon.stub()
  },
  template: { generate: sinon.stub() },
  print: {
    info: sinon.stub(),
    error: sinon.stub()
  },
  parameters: { first: null, options: {} }
})

test('has the right interface', t => {
  t.is(command.name, 'new')
  t.is(command.description, 'Creates a new gluegun cli')
  t.false(command.hidden)
  t.deepEqual(command.alias, ['n', 'create'])
  t.is(typeof command.run, 'function')
})

test('name is required', async t => {
  const context = createContext()
  context.parameters.first = null
  await command.run(context)
  const { error } = context.print
  t.is(error.getCall(0).args[0], 'You must provide a valid CLI name.')
  t.is(error.getCall(1).args[0], 'Example: gluegun new foo')
})

test('name cannot be blank', async t => {
  const context = createContext()
  context.parameters.first = ''
  await command.run(context)
  const { error } = context.print
  t.deepEqual(error.getCall(0).args, ['You must provide a valid CLI name.'])
  t.deepEqual(error.getCall(1).args, ['Example: gluegun new foo'])
})

test('name must pass regex', async t => {
  const context = createContext()
  const name = 'O M G'
  context.parameters.first = name
  await command.run(context)
  const { error } = context.print
  t.deepEqual(error.getCall(0).args, [
    `${name} is not a valid name. Use lower-case and dashes only.`
  ])
  t.deepEqual(error.getCall(1).args, [`Suggested: gluegun new ${strings.kebabCase(name)}`])
})

test('generates properly', async t => {
  const name = 'foo'
  const typescript = undefined
  const context = createContext()
  context.parameters.first = name

  // here we run the command
  const result = await command.run(context)

  // setup some conveniences so we don't have giant lines
  const { dir, chmodSync } = context.filesystem
  const { generate } = context.template
  const { spawn } = context.system
  const props = { name, typescript }

  // assure that the directory was created
  t.is(dir.firstCall.args[0], name)

  // tracks the number of files generated
  let i = 0

  // the executable file
  t.deepEqual(generate.getCall(i++).args[0], {
    template: `cli/bin/cli-executable.ejs`,
    target: `./${name}/bin/${name}`,
    props
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
    ['.gitignore.ejs', '.gitignore']
  ]

  // test that each our files get generated
  DEFAULT_FILES.forEach(file => {
    t.deepEqual(generate.getCall(i++).args[0], {
      template: `cli/${file[0]}`,
      target: `${name}/${file[1]}`,
      props
    })
  })

  // test permissions
  t.deepEqual(chmodSync.firstCall.args, [`${name}/bin/${name}`, '755'])

  // test package installation
  t.deepEqual(spawn.firstCall.args, [
    `cd ${props.name} && npm i && npm run format`,
    { shell: true, stdio: 'inherit', stderr: 'inherit' }
  ])

  t.is(result, `new ${name}`)
})

test('generates with typescript', async t => {
  const name = 'foo'
  const typescript = true
  const context = createContext()
  context.parameters.first = name
  context.parameters.options.typescript = true

  // here we run the command
  const result = await command.run(context)

  // setup some conveniences so we don't have giant lines
  const { dir, chmodSync } = context.filesystem
  const { generate } = context.template
  const { spawn } = context.system
  const props = { name, typescript }

  // assure that the directory was created
  t.is(dir.firstCall.args[0], name)

  // tracks the number of files generated
  let i = 0

  // the executable file
  t.deepEqual(generate.getCall(i++).args[0], {
    template: `cli/bin/cli-executable.ejs`,
    target: `./${name}/bin/${name}`,
    props
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
    ['.gitignore.ejs', '.gitignore']
  ]

  // test that each our files get generated
  DEFAULT_FILES.forEach(file => {
    t.deepEqual(generate.getCall(i++).args[0], {
      template: `cli/${file[0]}`,
      target: `${name}/${file[1]}`,
      props
    })
  })

  // test permissions
  t.deepEqual(chmodSync.firstCall.args, [`${name}/bin/${name}`, '755'])

  // test package installation
  t.deepEqual(spawn.firstCall.args, [
    `cd ${props.name} && npm i && npm run format`,
    { shell: true, stdio: 'inherit', stderr: 'inherit' }
  ])

  t.is(result, `new ${name}`)
})
