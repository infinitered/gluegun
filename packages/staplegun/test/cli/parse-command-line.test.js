const test = require('ava')
const parseCommandLine = require('../../src/cli/parse-command-line')

test('no command line options', t => {
  const argv = ['', '']
  const { namespace, args, options } = parseCommandLine(argv)
  t.falsy(namespace)
  t.falsy(args)
  t.deepEqual(options, {})
})

test('has a namespace', t => {
  const argv = ['', '', 'hello']
  const { namespace, args, options } = parseCommandLine(argv)
  t.is(namespace, argv[2])
  t.falsy(args)
  t.deepEqual(options, {})
})

test('has a namespace and 1 arg', t => {
  const argv = ['', '', 'hello', 'there']
  const { namespace, args, options } = parseCommandLine(argv)
  t.is(namespace, argv[2])
  t.is(args, argv[3])
  t.deepEqual(options, {})
})

test('has a namespace and 2 args', t => {
  const argv = ['', '', 'hello', 'there', 'dude']
  const { namespace, args, options } = parseCommandLine(argv)
  t.is(namespace, argv[2])
  t.is(args, `${argv[3]} ${argv[4]}`)
  t.deepEqual(options, {})
})

test('has a namespace and 2 args and bool flag', t => {
  const argv = ['', '', 'hello', 'there', 'dude', '--wave']
  const { namespace, args, options } = parseCommandLine(argv)
  t.is(namespace, argv[2])
  t.is(args, `${argv[3]} ${argv[4]}`)
  t.deepEqual(options, { wave: true })
})

test('has a namespace and 2 args and string', t => {
  const argv = ['', '', 'hello', 'there', 'dude', '--wave', 'furiously']
  const { namespace, args, options } = parseCommandLine(argv)
  t.is(namespace, argv[2])
  t.is(args, `${argv[3]} ${argv[4]}`)
  t.deepEqual(options, { wave: 'furiously' })
})
