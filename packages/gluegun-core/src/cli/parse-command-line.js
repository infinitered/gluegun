const minimist = require('minimist')
const { head, join, dissoc, slice } = require('ramda')

/**
 * Parses the command-line arguments into our expected constiutents.
 *
 * @return {{}} And object with our awesome keys.
 */
function parseCommandLine (argv = []) {
  // chop it up minimist!
  const cmd = minimist(argv.slice(2))

  // the pluginName is the first word
  const first = head(cmd._)

  // the rawCommand is the rest of the words
  const rest = join(' ', slice(1, Infinity, cmd._))

  // the options are the - and -- things that minimist parses
  // but also, pull out all the things we don't want to see
  const options = dissoc('_', cmd)

  // :shipit:
  return { first, rest, options }
}

module.exports = parseCommandLine
