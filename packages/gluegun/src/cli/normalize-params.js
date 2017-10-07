const minimist = require('minimist')

/**
 * Parses the command-line arguments into a normalized object.
 *
 * @return {{}} An object with our awesome keys.
 */
function normalizeParams (plugin, command, argv = []) {
  // chop it up minimist!
  const options = minimist(argv)
  const array = options._
  delete options._
  const raw = array.join(' ')

  // the plugin name or command is sometimes the first/second word -- delete them
  if (array[0] === plugin) {
    array.shift()
  }
  if (array[0] === command) {
    array.shift()
  }

  const first = array[0]
  const second = array[1]
  const third = array[2]

  // the string is the rest of the words
  const string = array.join(' ')

  // :shipit:
  return {
    plugin,
    command,
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
