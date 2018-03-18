import * as expect from 'expect'
import { Plugin } from './plugin'

test('default state', () => {
  const plugin = new Plugin()
  expect(plugin).toBeTruthy()
  expect(plugin.directory).toBeFalsy()
  expect(plugin.name).toBeFalsy()
  expect(plugin.hidden).toBe(false)
  expect(plugin.commands).toEqual([])
  expect(plugin.extensions).toEqual([])
  expect(plugin.defaults).toEqual({})
})
