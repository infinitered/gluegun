const test = require('ava')
const parseCommandLine = require('../../src/cli/parse-command-line')

test('no command line options', t => {
  const argv = ['', '']
  const { first, rest, options } = parseCommandLine(argv)
  t.falsy(first)
  t.falsy(rest)
  t.deepEqual(options, {})
})

test('has a pluginName', t => {
  const argv = ['', '', 'hello']
  const { first, rest, options } = parseCommandLine(argv)
  t.is(first, argv[2])
  t.falsy(rest)
  t.deepEqual(options, {})
})

test('has a pluginName and 1 arg', t => {
  const argv = ['', '', 'hello', 'there']
  const { first, rest, options } = parseCommandLine(argv)
  t.is(first, argv[2])
  t.is(rest, argv[3])
  t.deepEqual(options, {})
})

test('has a pluginName and 2 args', t => {
  const argv = ['', '', 'hello', 'there', 'dude']
  const { first, rest, options } = parseCommandLine(argv)
  t.is(first, argv[2])
  t.is(rest, `${argv[3]} ${argv[4]}`)
  t.deepEqual(options, {})
})

test('has a pluginName and 2 args and bool flag', t => {
  const argv = ['', '', 'hello', 'there', 'dude', '--wave']
  const { first, rest, options } = parseCommandLine(argv)
  t.is(first, argv[2])
  t.is(rest, `${argv[3]} ${argv[4]}`)
  t.deepEqual(options, { wave: true })
})

test('has a pluginName and 2 args and string', t => {
  const argv = ['', '', 'hello', 'there', 'dude', '--wave', 'furiously']
  const { first, rest, options } = parseCommandLine(argv)
  t.is(first, argv[2])
  t.is(rest, `${argv[3]} ${argv[4]}`)
  t.deepEqual(options, { wave: 'furiously' })
})
