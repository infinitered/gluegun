import test from 'ava'
import Command from './command'

test('default state', t => {
  const command = new Command()
  t.truthy(command)
  t.falsy(command.name)
  t.falsy(command.file)
  t.falsy(command.description)
  t.falsy(command.run)
  t.falsy(command.dashed)
  t.is(command.hidden, false)
})

test('matchesAlias', t => {
  const command = new Command()
  command.name = 'yogurt'
  command.alias = ['yo', 'y']

  t.truthy(command.matchesAlias(['asdf', 'i', 'yo']))
  t.truthy(command.matchesAlias('yogurt'))
  t.falsy(command.matchesAlias(['asdf', 'i', 'womp']))
})
