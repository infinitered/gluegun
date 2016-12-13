const test = require('ava')
const Runtime = require('../../src/domain/runtime')

test('gets a list of commands', t => {
  const r = new Runtime()
  r.load(`${__dirname}/../fixtures/good-plugins/simplest`)
  const p1 = r.load(`${__dirname}/../fixtures/good-plugins/threepack`)
  const c0 = p1.commands[0]
  const list = r.listCommands()

  t.is(list.length, 3)
  t.deepEqual(list[0], { plugin: p1, command: c0 })
})
