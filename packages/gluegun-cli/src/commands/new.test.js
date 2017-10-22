const test = require('ava')
const fs = require('fs')
const path = require('path')
const os = require('os')

const cli = require('../cli')

test('runs generate', async t => {
  const cwd = process.cwd()

  process.chdir(fs.mkdtempSync(path.join(os.tmpdir(), 'gluegun-cli-new-test')))

  const r = await cli(['new', 'foo'])
  t.is(r.result, 'new foo')

  process.chdir(cwd)
})
