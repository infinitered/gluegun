import * as expect from 'expect'
import * as sinon from 'sinon'
import * as uniqueTempDir from 'unique-temp-dir'
import * as stripANSI from 'strip-ansi'
import * as path from 'path'
import { run as cli } from './cli'

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

test('can create a new boilerplate cli', async () => {
  const tmp = uniqueTempDir({ create: true })
  process.chdir(tmp as string)

  const toolbox = await cli('new foo')
  expect(toolbox.command.name).toBe('new')

  const pkg = toolbox.filesystem.read(path.join(tmp, 'foo', 'package.json'), 'json')

  expect(typeof pkg).toBe('object')
  expect(pkg.name).toBe('foo')
  expect(pkg.private).toBeTruthy()
  expect(Object.keys(pkg.dependencies).includes('gluegun')).toBeTruthy()

  // Install local version of gluegun to test
  await toolbox.system.run(`cd ${path.join(tmp, 'foo')} && yarn add ${pwd} && yarn link`)

  // Try running the help command, see what it does
  const runCommand = await toolbox.system.run(`foo --help`)
  expect(stripANSI(runCommand)).toMatchSnapshot()

  // Try running the generate command, see what it does
  const genCommand = await toolbox.system.run(`foo g model test`)
  expect(stripANSI(genCommand)).toMatchSnapshot()

  // clean up
  process.chdir(pwd)
  toolbox.filesystem.remove(path.join(tmp, 'foo'))
})

test('can create a new boilerplate TypeScript cli', async () => {
  const tmp = uniqueTempDir({ create: true })
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

  // Try running the help command, see what it does
  const runCommand = await toolbox.system.run(`foo-ts --help`)
  expect(stripANSI(runCommand)).toMatchSnapshot()

  // Try running the generate command, see what it does
  const genCommand = await toolbox.system.run(`foo-ts g model test`)
  expect(stripANSI(genCommand)).toMatchSnapshot()

  // Add a command that exercises a lot of Gluegun features
  // Incidentally, it verifies that the template tool works
  const generateResult = await toolbox.template.generate({
    template: path.join('test', 'kitchen-sink-command.js.ejs'),
    target: path.join(tmp, 'foo-ts', 'commands', 'kitchen.js'),
  })

  // Verify the result of the generated command
  expect(generateResult.includes('module.exports = {')).toBe(true)

  // Run that command and check the result
  const kitchenCommand = await toolbox.system.run(`foo-ts kitchen`)
  console.log(kitchenCommand)

  // clean up
  process.chdir(pwd)
  toolbox.filesystem.remove(path.join(tmp, 'foo-ts'))
})
