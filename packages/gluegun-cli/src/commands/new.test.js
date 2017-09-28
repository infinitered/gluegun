const test = require('ava')
const cli = require('../cli')

test('runs generate', async t => {
  const r = await cli('new Foo')
  t.is(r.result, 'new Foo')
})
