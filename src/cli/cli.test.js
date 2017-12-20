const test = require('ava')
const cli = require('./cli')
const sinon = require('sinon')
const uniqueTempDir = require('unique-temp-dir')

sinon.stub(console, 'log')

test('can start the cli', async t => {
  const c = await cli()
  t.truthy(c)
})

test('can create a new boilerplate cli', async t => {
  const pwd = process.cwd()

  const tmp = uniqueTempDir({ create: true })
  process.chdir(tmp)

  const context = await cli('new foo')
  t.is(context.command.name, 'new')

  const pkg = context.filesystem.read(`${tmp}/foo/package.json`, 'json')

  t.is(pkg.name, 'foo')
  t.truthy(pkg.private)
  t.truthy(Object.keys(pkg.dependencies).includes('gluegun'))

  // Install local version of gluegun to test
  await context.system.run(`cd ${tmp}/foo && npm install ${pwd}`)

  // Try running the help command, see what it does
  const runCommand = await context.system.run(`${tmp}/foo/bin/foo help`)
  t.snapshot(runCommand)

  // Try running the generate command, see what it does
  const genCommand = await context.system.run(`${tmp}/foo/bin/foo g model test`)
  t.snapshot(genCommand)

  process.chdir(pwd)

  // clean up
  context.filesystem.remove(`${tmp}/foo`)
})
