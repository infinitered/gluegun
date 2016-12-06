const {
  always,
  curry,
  is,
  isEmpty,
  join,
  max,
  pipe,
  repeat,
  trim,
  when
} = require('ramda')

/**
 * Is this not a string?
 *
 * @param  {any}     value The value to check
 * @return {boolean}       True if it is not a string, otherwise false
 */
const isNotString = (value) => {
  return !is(String, value)
}

/**
 * Is this value a blank string?
 *
 * @param   {any}     value The value to check.
 * @returns {boolean}       True if it was, otherwise false.
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

module.exports = {
  isBlank,
  isNotString,
  leftPad,
  rightPad
}
