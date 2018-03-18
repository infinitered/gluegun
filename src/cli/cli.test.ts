import test from 'ava'
import * as sinon from 'sinon'
import * as uniqueTempDir from 'unique-temp-dir'
import { run as cli } from './cli'

sinon.stub(console, 'log')

const pwd = process.cwd()

test.serial('can start the cli', async t => {
  const c = await cli()
  t.truthy(c)
})

test.serial('can create a new boilerplate cli', async t => {
  const tmp = uniqueTempDir({ create: true })
  process.chdir(tmp as string)

  const toolbox = await cli('new foo')
  t.is(toolbox.command.name, 'new')

  const pkg = toolbox.filesystem.read(`${tmp}/foo/package.json`, 'json')

  t.is(typeof pkg, 'object')
  t.is(pkg.name, 'foo')
  t.truthy(pkg.private)
  t.truthy(Object.keys(pkg.dependencies).includes('gluegun'))

  // Install local version of gluegun to test
  await toolbox.system.run(`cd ${tmp}/foo && npm install ${pwd}`)

  // Try running the help command, see what it does
  const runCommand = await toolbox.system.run(`${tmp}/foo/bin/foo --help`)
  t.snapshot(runCommand)

  // Try running the generate command, see what it does
  const genCommand = await toolbox.system.run(`${tmp}/foo/bin/foo g model test`)
  t.snapshot(genCommand)

  // clean up
  process.chdir(pwd)
  toolbox.filesystem.remove(`${tmp}/foo`)
})

test.serial('can create a new boilerplate TypeScript cli', async t => {
  const tmp = uniqueTempDir({ create: true })
  process.chdir(tmp as string)

  const toolbox = await cli('new foo-ts --typescript')
  t.is(toolbox.command.name, 'new')

  const pkg = toolbox.filesystem.read(`${tmp}/foo-ts/package.json`, 'json')

  t.is(typeof pkg, 'object')
  t.is(pkg.name, 'foo-ts')
  t.truthy(pkg.private)
  t.truthy(Object.keys(pkg.dependencies).includes('gluegun'))

  // Install local version of gluegun to test
  await toolbox.system.run(`cd ${tmp}/foo-ts && npm install ${pwd}`)

  // Try running the help command, see what it does
  const runCommand = await toolbox.system.run(`${tmp}/foo-ts/bin/foo-ts --help`)
  t.snapshot(runCommand)

  // Try running the generate command, see what it does
  const genCommand = await toolbox.system.run(`${tmp}/foo-ts/bin/foo-ts g model test`)
  t.snapshot(genCommand)

  // Add a command that exercises a lot of Gluegun features
  // Incidentally, it verifies that the template tool works
  const generateResult = await toolbox.template.generate({
    template: `test/kitchen-sink-command.js.ejs`,
    target: `${tmp}/foo-ts/commands/kitchen.js`,
  })

  // Verify the result of the generated command
  t.true(generateResult.includes('module.exports = {'))

  // Run that command and check the result
  const kitchenCommand = await toolbox.system.run(`${tmp}/foo-ts/bin/foo-ts kitchen`)
  console.log(kitchenCommand)

  // clean up
  process.chdir(pwd)
  toolbox.filesystem.remove(`${tmp}/foo-ts`)
})
