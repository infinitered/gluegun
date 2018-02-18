import test from 'ava'
import * as os from 'os'
import * as path from 'path'
import { split } from 'ramda'
import { Toolbox } from '../domain/toolbox'
import createExtension from './filesystem-extension'

test('has the proper interface', t => {
  const toolbox = new Toolbox()
  createExtension(toolbox)
  const ext = toolbox.filesystem

  t.truthy(ext)

  // a few dumb checks to ensure we're talking to jetpack
  t.is(typeof ext.copy, 'function')
  t.is(typeof ext.path, 'function')
  t.is(typeof ext.subdirectories, 'function')
  t.is(split('\n', ext.read(__filename))[0], "import test from 'ava'")
  // the extra values we've added
  t.is(ext.eol, os.EOL)
  t.is(ext.separator, path.sep)
})
