import test from 'ava'
import { Toolbox } from '../domain/toolbox'
import createExtension from './strings-extension'

test('has the proper interface', t => {
  const toolbox = new Toolbox()
  createExtension(toolbox)
  const ext = toolbox.strings
  t.truthy(ext)
  t.is(typeof ext.trim, 'function')
  t.is(ext.trim('  lol'), 'lol')
})
