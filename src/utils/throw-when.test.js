const { T, F } = require('ramda')
const test = require('ava')
const throwWhen = require('./throw-when')

test('it throws', t => {
  t.throws(() => throwWhen('lulz', T, 1))
})

test("it doesn't throws", t => {
  throwWhen('lulz', F, 1)
  t.pass()
})
