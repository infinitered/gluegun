const test = require('ava')
const cli = require('../../cli')

test('runs generate', async t => {
  const r = await cli(['generate', 'help'])
  t.is(r.result, 'generate helped')
})
