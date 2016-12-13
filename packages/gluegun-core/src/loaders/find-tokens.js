const { pipe, split, map, match, trim, head, tail, last, fromPairs } = require('ramda')
const { isNotString } = require('../utils/string-utils')
const throwWhen = require('../utils/throw-when')

const rxCommands = /\s(@cliCommand|@cliDescription|@extension)\s+(.*)/g
const rxKey = /^@[a-zA-Z]*/g
const rxValue = /^@[a-zA-Z]*/

/**
 * Extracts @tokens located within a string.
 *
 * @param {string} source The source code to search
 * @return {{}}           Key/value pairs of tokens we found
 */
module.exports = function findTokens (source) {
  // sanity check
  throwWhen('load tokens requires a string', isNotString, source)

  return pipe(
    match(rxCommands),
    map(trim),
    map(x => [
      pipe(match(rxKey), head, tail)(x), // key
      pipe(split(rxValue), last, trim)(x)   // value
    ]),
    fromPairs
  )(source)
}
