const test = require('ava')
const cli = require('../../cli')

test('runs generate', async t => {
  const r = await cli('generate')
  t.is(r.result, 'generated')
})
