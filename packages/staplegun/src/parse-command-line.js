const minimist = require('minimist')
const { head, join, dissoc, slice } = require('ramda')

/**
 * Parses the command-line arguments into our expected constiutents.
 *
 * @return {{}} And object with our awesome keys.
 */
function parseCommandLine () {
  // chop it up minimist!
  const cmd = minimist(process.argv.slice(2))

  // the namespace is the first word
  const namespace = head(cmd._)

  // the arguments are the rest of the words
  const args = join(' ', slice(1, Infinity, cmd._))

  // the options are the - and -- things that minimist parses
  // without the _ which is their arguments.
  const options = dissoc('_', cmd)

  // :shipit:
  return { namespace, args, options }
}

module.exports = parseCommandLine
