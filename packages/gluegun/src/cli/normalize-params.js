const minimist = require('minimist')

/**
 * Parses the command-line arguments into a normalized object.
 *
 * @param {string} plugin     Plugin name
 * @param {Command} command   The command being run
 * @param {[]} argv           List of command arguments
 * @return {{}}               An object with normalized parameters
 */
function normalizeParams (plugin, command, argv = []) {
  // chop it up minimist!
  const options = minimist(argv)
  const array = command.args
  delete options._
  const raw = array.join(' ')

  const first = array[0]
  const second = array[1]
  const third = array[2]

  // the string is the rest of the words
  const string = array.join(' ')

  // :shipit:
  return {
    plugin,
    command: command.name,
    first,
    second,
    third,
    raw,
    string,
    array,
    options,
    argv
  }
}

module.exports = normalizeParams
