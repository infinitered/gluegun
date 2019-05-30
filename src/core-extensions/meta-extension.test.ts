import * as expect from 'expect'
import { Toolbox } from '../domain/toolbox'
import { Runtime } from '../runtime/runtime'
import createExtension, { GluegunMeta } from './meta-extension'

test('has the proper interface', () => {
  const toolbox = new Toolbox()
  const fakeRuntime = { defaultPlugin: { directory: '/the/path' } } as Runtime
  toolbox.runtime = fakeRuntime
  createExtension(toolbox)
  const ext = toolbox.meta as GluegunMeta
  expect(ext).toBeTruthy()
  expect(ext.src).toEqual('/the/path')
  expect(typeof ext.version).toBe('function')
  expect(typeof ext.commandInfo).toBe('function')
  expect(typeof ext.checkForUpdate).toBe('function')
})
