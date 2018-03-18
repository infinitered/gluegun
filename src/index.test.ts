import * as expect from 'expect'
import * as exported from './index'

test('create', () => {
  expect(exported).toBeTruthy()
  expect(typeof exported.build).toBe('function')
  const { build } = exported
  const runtime = build('test').create()
  expect(runtime.brand).toBe('test')
  const runtime2 = build()
    .brand('test2')
    .create()
  expect(runtime2.brand).toBe('test2')
})

test('print', () => {
  expect(typeof exported.print.printCommands).toBe('function')
  expect(typeof exported.print.info).toBe('function')
})

test('strings', () => {
  expect(exported.strings.lowerCase('HI')).toBe('hi')
})

test('filesystem', () => {
  expect(exported.filesystem).toBeTruthy()
  expect(exported.filesystem.eol).toBeTruthy()
  expect(exported.filesystem.separator).toBeTruthy()
  expect(exported.filesystem.cwd()).toBe(process.cwd())
})

test('system', () => {
  expect(exported.system).toBeTruthy()
  expect(exported.system.which('node')).toBeTruthy()
})

test('prompt', () => {
  expect(exported.prompt).toBeTruthy()
  expect(typeof exported.prompt.confirm).toBeTruthy()
})

test('http', () => {
  expect(exported.http).toBeTruthy()
  expect(typeof exported.http.create).toBeTruthy()
  const api = exported.http.create({ baseURL: 'https://api.github.com/v3' })
  expect(typeof api.get).toBe('function')
  expect(typeof api.post).toBe('function')
})

test('patching', () => {
  expect(exported.patching).toBeTruthy()
  expect(typeof exported.patching.exists).toBeTruthy()
  expect(typeof exported.patching.update).toBeTruthy()
  expect(typeof exported.patching.append).toBeTruthy()
  expect(typeof exported.patching.prepend).toBeTruthy()
  expect(typeof exported.patching.replace).toBeTruthy()
  expect(typeof exported.patching.patch).toBeTruthy()
})
