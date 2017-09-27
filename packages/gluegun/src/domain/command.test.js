const test = require('ava')
const Command = require('./command')

test('default state', t => {
  const command = new Command()
  t.truthy(command)
  t.falsy(command.name)
  t.falsy(command.file)
  t.falsy(command.description)
  t.falsy(command.run)
  t.is(command.hidden, false)
})
