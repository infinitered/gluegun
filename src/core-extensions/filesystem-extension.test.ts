import * as expect from 'expect'
import * as os from 'os'
import * as path from 'path'
import { Toolbox } from '../domain/toolbox'
import createExtension from './filesystem-extension'

test('has the proper interface', () => {
  const toolbox = new Toolbox()
  createExtension(toolbox)
  const ext = toolbox.filesystem

  expect(ext).toBeTruthy()

  // a few dumb checks to ensure we're talking to jetpack
  expect(typeof ext.copy).toBe('function')
  expect(typeof ext.path).toBe('function')
  expect(typeof ext.subdirectories).toBe('function')
  expect(ext.read(__filename).split(os.EOL)[0]).toBe(`import * as expect from 'expect'`)
  // the extra values we've added
  expect(ext.eol).toBe(os.EOL)
  expect(ext.separator).toBe(path.sep)
})
