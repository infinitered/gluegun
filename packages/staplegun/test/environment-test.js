import test from 'ava'
import Environment from '../src/environment'

test('creates an environment', t => {
  const env = new Environment()
  t.true(env.isHey())
})
