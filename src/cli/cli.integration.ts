import * as expect from 'expect'
import * as sinon from 'sinon'
import * as uniqueTempDir from 'unique-temp-dir'
import * as path from 'path'

import { run as cli } from './cli'

const stripANSI = require('strip-ansi')

sinon.stub(console, 'log')

const pwd = process.cwd()

jest.setTimeout(5 * 60 * 1000)

test('can start the cli', async () => {
  const c = await cli()
  expect(c).toBeTruthy()
})

test('can create a new boilerplate TypeScript cli', async () => {
  const tmp = uniqueTempDir({ create: true })
  console.log(tmp)
  process.chdir(tmp as string)

  const toolbox = await cli('new foo-ts --bun')
  expect(toolbox.command.name).toBe('new')

  process.chdir(`${tmp}/foo-ts`)

  // add local version of gluegun to the newly created project
  const gluegunPath = path.join(__dirname, '..', '..')
  const gluegunAddCommand = `cd ${gluegunPath} && bun link && cd - && bun link gluegun`
  await toolbox.system.spawn(`${gluegunAddCommand}`)

  const pkg = toolbox.filesystem.read('./package.json', 'json')

  expect(typeof pkg).toBe('object')
  expect(pkg.name).toBe('foo-ts')
  expect(pkg.private).toBeTruthy()
  expect(Object.keys(pkg.dependencies).includes('gluegun')).toBeTruthy()

  // Run the tests

  const testResults = await toolbox.system.run(`bun run test`)
  expect(testResults).not.toContain('FAIL')

  // Try running the help command, see what it does
  const runCommand = await toolbox.system.exec(`bun run ./bin/foo-ts --help`)
  const cleanCmd = stripANSI(runCommand)
  expect(cleanCmd).toMatch(/version \(v\)/)
  expect(cleanCmd).toMatch(/Output the version number/)
  expect(cleanCmd).toMatch(/generate \(g\)/)
  expect(cleanCmd).toMatch(/help \(h\)/)

  // Try running the generate command, see what it does
  const genCommand = await toolbox.system.exec(`bun run ./bin/foo-ts g flub`)
  console.log(genCommand)
  const genFile = toolbox.filesystem.read(`${tmp}/foo-ts/models/flub-model.ts`)
  expect(genFile).toMatch(/name: 'flub'/)

  // Add a command that exercises a lot of Gluegun features
  // Incidentally, it verifies that the template tool works
  const generateResult = await toolbox.template.generate({
    template: `test/kitchen-sink-command.js.ejs`,
    target: `${tmp}/foo-ts/src/commands/kitchen.js`,
  })

  // Verify the result of the generated command
  expect(generateResult).toMatch(/module\.exports = \{/)

  // Run that command and check the result
  const kitchenCommand = await toolbox.system.exec(`bun run ./bin/foo-ts kitchen`)
  expect(kitchenCommand).toMatch(/Hello. I am a chatty plugin./)
  expect(kitchenCommand).toMatch(/Busey/)

  // clean up
  process.chdir(pwd)
  toolbox.filesystem.remove(path.join(tmp, 'foo-ts'))
})
