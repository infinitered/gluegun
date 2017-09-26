const minimist = require('minimist')

/**
 * Parses the command-line arguments into a normalized object.
 *
 * @return {{}} An object with our awesome keys.
 */
function normalizeParams (plugin, command, argv = []) {
  // chop it up minimist!
  const { _: array, ...options } = minimist(argv.slice(2))

  // the plugin name or command is sometimes the first/second word -- delete them
  if (array[0] == plugin) { array.shift() }
  if (array[0] == command) { array.shift() }

  const first = array[0]
  const second = array[1]
  const third = array[2]

  // the rawCommand is the rest of the words
  const raw = array.join(' ')

  // :shipit:
  return { argv, first, second, third, raw, array, options }
}

module.exports = normalizeParams

