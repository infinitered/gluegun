import test from 'ava'
import { Toolbox } from '../domain/toolbox'
import createExtension from './prompt-extension'

test('has the proper interface', t => {
  const toolbox = new Toolbox()
  createExtension(toolbox)
  const ext = toolbox.prompt
  t.truthy(ext)
  t.is(typeof ext.ask, 'function')
  t.is(typeof ext.separator, 'function')
  t.is(typeof ext.question, 'function')
})
