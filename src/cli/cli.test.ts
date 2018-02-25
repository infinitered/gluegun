import test from 'ava'
import * as sinon from 'sinon'
import * as uniqueTempDir from 'unique-temp-dir'
import { run as cli } from './cli'

sinon.stub(console, 'log')

test('can start the cli', async t => {
  const c = await cli()
  t.truthy(c)
})

test('can create a new boilerplate cli', async t => {
  const pwd = process.cwd()

  const tmp = uniqueTempDir({ create: true })
  process.chdir(tmp)

  const toolbox = await cli('new foo')
  t.is(toolbox.command.name, 'new')

  const pkg = toolbox.filesystem.read(`${tmp}/foo/package.json`, 'json')

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

  process.chdir(pwd)

  // clean up
  toolbox.filesystem.remove(`${tmp}/foo`)
})
