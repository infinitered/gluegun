const test = require('ava')
const Runtime = require('./runtime')
const RunContext = require('./run-context')
const { pipe, pluck, join } = require('ramda')

test('loads the core extensions in the right order', t => {
  const r = new Runtime()
  const list = pipe(pluck('name'), join(', '))(r.extensions)

  t.is(list, 'strings, print, template, filesystem, semver, system, http, prompt, patching')
})

test('extensions can return new contexts or mutate the existing one', t => {
  t.plan(2)

  const r = new Runtime()

  r.addExtension('firstExtension', (context) => {
    // mutate the old context
    context.foo = 'NOPE'

    // return a brand-new context
    const newContext = new RunContext()
    newContext.foo = 'AAAA'
    return newContext
  })

  r.addExtension('secondExtension', (context) => {
    // make sure the new context came through
    t.is('AAAA', context.foo)
    // mutate it
    context.foo = 'BBBB'
    // doesn't return, so use the one we just mutated
  })

  r.brand = 'test'
  r.defaultPlugin = {
    name: 'test',
    commands: [{
      name: 'test',
      commandPath: ['test'],
      run: (context) => {
        // check to make sure the mutation came through
        t.is('BBBB', context.foo)
      }
    }]
  }
  r.plugins = [ r.defaultPlugin ]

  r.run('test test')
})
