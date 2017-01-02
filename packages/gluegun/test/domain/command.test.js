const test = require('ava')
const Command = require('../../src/domain/command')

test('default state', t => {
  const command = new Command()
  t.truthy(command)
  t.falsy(command.name)
  t.falsy(command.file)
  t.falsy(command.description)
  t.falsy(command.run)
  t.is(command.hidden, false)
  t.is(command.loadState, 'none')
  t.is(command.errorState, 'none')
})
