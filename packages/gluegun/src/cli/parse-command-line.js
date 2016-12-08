const minimist = require('minimist')
const { head, join, dissoc, slice, pipe } = require('ramda')

/**
 * Parses the command-line arguments into our expected constiutents.
 *
 * @return {{}} And object with our awesome keys.
 */
function parseCommandLine (argv = []) {
  // chop it up minimist!
  const cmd = minimist(argv.slice(2))

  // the namespace is the first word
  const namespace = head(cmd._)

  // the arguments are the rest of the words
  const args = join(' ', slice(1, Infinity, cmd._))

  // grab the brand if any
  const brand = cmd['gluegun-brand']

  // the options are the - and -- things that minimist parses
  // but also, pull out all the things we don't want to see
  const options = pipe(
    dissoc('_'),
    dissoc('gluegun-brand')
  )(cmd)

  // :shipit:
  return { namespace, args, options, brand }
}

module.exports = parseCommandLine
