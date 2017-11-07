const test = require('ava')
const cli = require('../../cli')
const sinon = require('sinon')
sinon.stub(console, 'log')

test('runs generate', async t => {
  const r = await cli(['generate'])
  t.is(r.result, 'generated')
})
