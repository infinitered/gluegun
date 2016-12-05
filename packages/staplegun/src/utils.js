const { curry, when, pipe, trim, isEmpty, is, always, complement, max, join, repeat } = require('ramda')
const jetpack = require('fs-jetpack')

/**
 * The opposite of is.  Great restraint made me not call this: aint.
 */
const isnt = complement(is)

/**
 * Is this not a string?
 */
const isNotString = (value) => {
  return !is(String, value)
}

/**
 * Is this value a blank string?
 */
const isBlank = (value) => {
  const check = pipe(
    when(isNotString, always('')),
    trim,
    isEmpty
  )

  return check(value)
}

/**
 * Throw an error with the given message.
 */
function thrower (message) {
  throw new Error(message)
}

/**
 * Throws an error if the predicate fails when applying value.
 *
 * @export
 * @param {string} message - The message to say in the error
 * @param {Function} predicate - The function to invoke
 * @param {*} value - The value to apply to the predicate
 */
const throwWith = curry(
  function throwWith (message, predicate, value) {
    when(predicate, () => thrower(message), value)
  }
)

/**
 * Expands a string to fit within a certain size by filling
 * characters to the front.
 *
 * @param {number} length The size to fill to
 * @param {string} fill   The character to fill with
 * @param {string} value  The string we want to fill
 */
const leftPad = curry((length, fill, value) => {
  const again = max(0, length - value.length)
  return join('', repeat(fill, again)) + value
})

/**
 * Expands a string to fit within a certain size by filling
 * characters to the back.
 *
 * @param {number} length The size to fill to
 * @param {string} fill   The character to fill with
 * @param {string} value  The string we want to fill
 */
const rightPad = curry((length, fill, value) => {
  const again = max(0, length - value.length)
  return value + join('', repeat(fill, again))
})

/**
 * Is this a file?
 */
const isFile = (file) => jetpack.exists(file) === 'file'

/**
 * Is this not a file?
 */
const isNotFile = complement(isFile)

/**
 * Is this a directory?
 */
const isDirectory = (dir) => jetpack.exists(dir) === 'dir'

/**
 * Is this not a directory?
 */
const isNotDirectory = complement(isDirectory)

module.exports = {
  isNotDirectory,
  isDirectory,
  isNotFile,
  isFile,
  rightPad,
  leftPad,
  isnt,
  isNotString,
  isBlank,
  thrower,
  throwWith
}
