const test = require('ava')
const RunContext = require('../../src/domain/run-context')

test('initial state', t => {
  const ctx = new RunContext()
  t.falsy(ctx.fullArguments)
  t.falsy(ctx.stringArguments)
  t.falsy(ctx.arguments)
  t.falsy(ctx.options)
  t.falsy(ctx.result)
  t.falsy(ctx.error)
  t.falsy(ctx.config)
  t.falsy(ctx.directories)
})
