import test from 'ava'
import { Toolbox } from './toolbox'

test('initial state', t => {
  const ctx = new Toolbox()
  t.falsy(ctx.result)
  t.deepEqual(ctx.config, {})
  t.deepEqual(ctx.parameters, {})
})
