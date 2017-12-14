const minimist = require('minimist')
const { merge } = require('ramda')

function parseParams (argv, extraOpts = {}) {
  // chop it up minimist!
  const parsed = minimist(argv)
  const array = parsed._.slice()
  delete parsed._
  const options = merge(parsed, extraOpts)
  return { array, options }
}

/**
 * Constructs the parameters object.
 *
 * @param {{}} params         Provided parameters
 * @return {{}}               An object with normalized parameters
 */
function createParams (params) {
  // make a copy of the args so we can mutate it
  const array = params.array.slice()

  // Remove the first two elements from the array if they're the plugin and command
  if (array[0] === params.plugin) array.shift()
  if (array[0] === params.command) array.shift()

  const first = array[0]
  const second = array[1]
  const third = array[2]

  // the string is the rest of the words
  const string = array.join(' ')

  // :shipit:
  return Object.assign(params, {
    array,
    first,
    second,
    third,
    string
  })
}

module.exports = { parseParams, createParams }
