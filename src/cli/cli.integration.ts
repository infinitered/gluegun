import * as expect from 'expect'
import * as sinon from 'sinon'
import * as uniqueTempDir from 'unique-temp-dir'
import * as path from 'path'
import { run as cli } from './cli'

const stripANSI = require('strip-ansi')

sinon.stub(console, 'log')

const pwd = process.cwd()

// set jest timeout to very long, because these take a while
beforeAll(() => jest.setTimeout(180 * 1000))
// reset back
afterAll(() => jest.setTimeout(5 * 1000))

test('can start the cli', async () => {
  const c = await cli()
  expect(c).toBeTruthy()
})

test('can create a new boilerplate JavaScript cli', async () => {
  const tmp = uniqueTempDir({ create: true })
  process.chdir(tmp as string)

  const toolbox = await cli('new foo --javascript')
  expect(toolbox.command.name).toBe('new')

  const pkg = toolbox.filesystem.read(path.join(tmp, 'foo', 'package.json'), 'json')

  expect(typeof pkg).toBe('object')
  expect(pkg.name).toBe('foo')
  expect(pkg.private).toBeTruthy()
  expect(Object.keys(pkg.dependencies).includes('gluegun')).toBeTruthy()

  // Install local version of gluegun to test
  await toolbox.system.run(`cd ${path.join(tmp, 'foo')} && yarn add ${pwd} && yarn link`)

  // Run the tests
  const testResults = await toolbox.system.run(`cd ${tmp}/foo && yarn test`)
  expect(testResults).toContain('jest')

  // Try running the help command, see what it does
  const runCommand = await toolbox.system.exec(`node ${tmp}/foo/bin/foo --help`)
  const cleanCmd = stripANSI(runCommand)
  expect(cleanCmd).toMatch(/version \(v\)/)
  expect(cleanCmd).toMatch(/Output the version number/)
  expect(cleanCmd).toMatch(/generate \(g\)/)
  expect(cleanCmd).toMatch(/help \(h\)/)

  // Try running the generate command, see what it does
  const genCommand = await toolbox.system.exec(`node ${tmp}/foo/bin/foo g flub`)
  console.log(genCommand)
  const genFile = toolbox.filesystem.read(`${tmp}/models/flub-model.js`)
  expect(genFile).toMatch(/name\: \'flub\'/)

  // clean up
  process.chdir(pwd)
  toolbox.filesystem.remove(path.join(tmp, 'foo'))
})

test('can create a new boilerplate TypeScript cli', async () => {
  const tmp = uniqueTempDir({ create: true })
  console.log(tmp)
  process.chdir(tmp as string)

  const toolbox = await cli('new foo-ts --typescript')
  expect(toolbox.command.name).toBe('new')

  const pkg = toolbox.filesystem.read(path.join(tmp, 'foo-ts', 'package.json'), 'json')

  expect(typeof pkg).toBe('object')
  expect(pkg.name).toBe('foo-ts')
  expect(pkg.private).toBeTruthy()
  expect(Object.keys(pkg.dependencies).includes('gluegun')).toBeTruthy()

  // Install local version of gluegun to test
  await toolbox.system.run(`cd ${path.join(tmp, 'foo-ts')} && yarn add ${pwd} && yarn link`)

  // Run the tests
  const testResults = await toolbox.system.run(`cd ${tmp}/foo-ts && yarn test`)
  expect(testResults).toContain('jest')

  // Try running the help command, see what it does
  const runCommand = await toolbox.system.exec(`node ${tmp}/foo-ts/bin/foo-ts --help`)
  const cleanCmd = stripANSI(runCommand)
  expect(cleanCmd).toMatch(/version \(v\)/)
  expect(cleanCmd).toMatch(/Output the version number/)
  expect(cleanCmd).toMatch(/generate \(g\)/)
  expect(cleanCmd).toMatch(/help \(h\)/)

  // Try running the generate command, see what it does
  const genCommand = await toolbox.system.exec(`node ${tmp}/foo-ts/bin/foo-ts g flub`)
  console.log(genCommand)
  const genFile = toolbox.filesystem.read(`${tmp}/models/flub-model.ts`)
  expect(genFile).toMatch(/name\: \'flub\'/)

  // Add a command that exercises a lot of Gluegun features
  // Incidentally, it verifies that the template tool works
  const generateResult = await toolbox.template.generate({
    template: `test/kitchen-sink-command.js.ejs`,
    target: `${tmp}/foo-ts/src/commands/kitchen.js`,
  })

  // Verify the result of the generated command
  expect(generateResult).toMatch(/module\.exports \= \{/)

  // Run that command and check the result
  const kitchenCommand = await toolbox.system.exec(`node ${tmp}/foo-ts/bin/foo-ts kitchen`)
  expect(kitchenCommand).toMatch(/Hello. I am a chatty plugin./)
  expect(kitchenCommand).toMatch(/Busey/)

  // clean up
  process.chdir(pwd)
  toolbox.filesystem.remove(path.join(tmp, 'foo-ts'))
})
