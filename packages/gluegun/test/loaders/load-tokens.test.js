import test from 'ava'
import findTokens from '../../src/loaders/find-tokens'

test('handles wierd input', t => {
  t.throws(() => findTokens())
  t.throws(() => findTokens(1))
  t.throws(() => findTokens([]))
  t.throws(() => findTokens({}))
  t.throws(() => findTokens(() => {}))
  t.throws(() => findTokens(true))
  t.throws(() => findTokens(null))
  t.throws(() => findTokens(undefined))
})

test('handles blank strings', t => {
  t.deepEqual(findTokens('', []), {})
})

test('tokens start after whitespace', t => {
  t.deepEqual(findTokens('// hello@hi', []), {})
})

test('finds @cliCommand', t => {
  t.deepEqual(findTokens('// @cliCommand steve', ['cliCommand']), {
    cliCommand: 'steve'
  })
  t.deepEqual(findTokens('/**\n@cliCommand steve ', ['cliCommand']), {
    cliCommand: 'steve'
  })
})

test('finds @cliDescription', t => {
  t.deepEqual(findTokens('// @cliDescription steve', ['cliDescription']), {
    cliDescription: 'steve'
  })
  t.deepEqual(findTokens('/**\n@cliDescription steve ', ['cliDescription']), {
    cliDescription: 'steve'
  })
})

test('finds @cliHidden', t => {
  t.deepEqual(findTokens('// @cliHidden steve', ['cliHidden']), {
    cliHidden: 'steve'
  })
  t.deepEqual(findTokens('/**\n@cliHidden steve ', ['cliHidden']), {
    cliHidden: 'steve'
  })
})

test('finds @cliAlias', t => {
  t.deepEqual(findTokens('// @cliAlias steve', ['cliAlias']), {
    cliAlias: 'steve'
  })
  t.deepEqual(findTokens('/**\n@cliAlias steve ', ['cliAlias']), {
    cliAlias: 'steve'
  })
})

test('finds @extension', t => {
  t.deepEqual(findTokens('// @extension steve', ['extension']), {
    extension: 'steve'
  })
  t.deepEqual(findTokens('/**\n@extension steve ', ['extension']), {
    extension: 'steve'
  })
})
