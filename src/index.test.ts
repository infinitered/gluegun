import test from 'ava'
import * as exported from './index'

test('create', t => {
  t.truthy(exported)
  t.is(typeof exported.build, 'function')
  const { build } = exported
  const runtime = build()
    .brand('test')
    .create()
  t.is(runtime.brand, 'test')
})

test('print', t => {
  t.is(typeof exported.printCommands, 'function')
  t.is(typeof exported.print.info, 'function')
})

test('strings', t => {
  t.is(exported.strings.lowerCase('HI'), 'hi')
})

test('filesystem', t => {
  t.truthy(exported.filesystem)
  t.truthy(exported.filesystem.eol)
  t.truthy(exported.filesystem.separator)
  t.is(exported.filesystem.cwd(), process.cwd())
})

test('system', t => {
  t.truthy(exported.system)
  t.truthy(exported.system.which('node'))
})

test('prompt', t => {
  t.truthy(exported.prompt)
  t.truthy(typeof exported.prompt.confirm, 'function')
})

test('http', t => {
  t.truthy(exported.http)
  t.truthy(typeof exported.http.create, 'function')
  const api = exported.http.create({ baseURL: 'https://api.github.com/v3' })
  t.is(typeof api.get, 'function')
  t.is(typeof api.post, 'function')
})

test('generate', async t => {
  t.truthy(exported.template)
  const actual = await exported.template.generate({
    template: './src/fixtures/good-plugins/generate/templates/simple.ejs',
    directory: process.cwd(),
  })
  t.is(actual, 'simple file\n')
})

test('patching', t => {
  t.truthy(exported.patching)
  t.truthy(typeof exported.patching.exists, 'function')
  t.truthy(typeof exported.patching.update, 'function')
  t.truthy(typeof exported.patching.append, 'function')
  t.truthy(typeof exported.patching.prepend, 'function')
  t.truthy(typeof exported.patching.replace, 'function')
  t.truthy(typeof exported.patching.patch, 'function')
})
