import * as expect from 'expect'
import { Toolbox } from '../domain/toolbox'
import createExtension from './prompt-extension'

test('has the proper interface', () => {
  const toolbox = new Toolbox()
  createExtension(toolbox)
  const ext = toolbox.prompt
  expect(ext).toBeTruthy()
  expect(typeof ext.ask).toBe('function')
  expect(typeof ext.separator).toBe('function')
  expect(typeof ext.question).toBe('function')
})
