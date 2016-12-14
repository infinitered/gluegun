const test = require('ava')
const cli = require('../src/cli')

test('can start the cli', async t => {
  const c = await cli()
  t.truthy(c)
})
