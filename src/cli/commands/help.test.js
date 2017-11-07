const test = require('ava')
const cli = require('../cli')
const sinon = require('sinon')
sinon.stub(console, 'log')

test('runs generate', async t => {
  const r = await cli(['help'])
  t.is(r.result, 'helped')
})
