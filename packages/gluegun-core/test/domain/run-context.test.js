const test = require('ava')
const RunContext = require('../../src/domain/run-context')

test('initial state', t => {
  const ctx = new RunContext()
  t.falsy(ctx.result)
  t.falsy(ctx.error)
  t.deepEqual(ctx.config, {})
  t.deepEqual(ctx.parameters, {})
})
