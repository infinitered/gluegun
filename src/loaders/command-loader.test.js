const test = require('ava')
const { loadCommandFromFile, loadCommandFromPreload } = require('./command-loader')

test('loading from a missing file', async t => {
  const error = await t.throws(() => loadCommandFromFile('foo.js'), Error)
  t.is(error.message, "Error: couldn't load command (this isn't a file): foo.js")
})

test('deals with weird input', async t => {
  const error = await t.throws(() => loadCommandFromFile(), Error)
  t.is(error.message, "Error: couldn't load command (file is blank): undefined")
})

test('open a weird js file', async t => {
  const file = `${__dirname}/../fixtures/bad-modules/text.js`
  const error = await t.throws(() => loadCommandFromFile(file), Error)
  t.is(error.message, `hello is not defined`)
})

test('default but no run property exported', async t => {
  const file = `${__dirname}/../fixtures/good-modules/module-exports-object.js`
  const error = await t.throws(() => loadCommandFromFile(file), Error)
  t.is(
    error.message,
    `Error: Couldn't load command module-exports-object -- needs a "run" property with a function.`
  )
})

test('fat arrows', async t => {
  const file = `${__dirname}/../fixtures/good-modules/module-exports-fat-arrow-fn.js`
  await t.notThrows(() => loadCommandFromFile(file))
})

test('load command from preload', async t => {
  const command = loadCommandFromPreload({
    name: 'hello',
    description: 'yiss dream',
    alias: ['z'],
    dashed: true,
    run: context => 'ran!'
  })

  t.is(command.name, 'hello')
  t.is(command.description, 'yiss dream')
  t.is(command.hidden, false)
  t.deepEqual(command.alias, ['z'])
  t.is(command.run(), 'ran!')
  t.is(command.file, null)
  t.is(command.dashed, true)
  t.deepEqual(command.commandPath, ['hello'])
})
