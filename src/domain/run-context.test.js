const test = require('ava')
const RunContext = require('./run-context')

test('initial state', t => {
  const ctx = new RunContext()
  t.falsy(ctx.result)
  t.falsy(ctx.error)
  t.deepEqual(ctx.config, {})
  t.deepEqual(ctx.parameters, {})
})
