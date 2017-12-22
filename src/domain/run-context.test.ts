import test from 'ava'
import RunContext from './run-context'

test('initial state', t => {
  const ctx = new RunContext()
  t.falsy(ctx.result)
  t.falsy(ctx.error)
  t.deepEqual(ctx.config, {})
  t.deepEqual(ctx.parameters, {})
})
