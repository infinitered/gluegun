const { always, is, isEmpty, pipe, when } = require('ramda')
const _ = require('lodash')

// NOTE: These functions all lead with the string first because
// that format is compatible with Nunjucks' filters.

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
 * Returns the value it is given
 *
 * @param {any} value
 * @returns     the value.
 */
function identity (value) {
  return value
}

/**
 * Converts the value toCamelCase.
 *
 * @param {string} value The string to convert
 * @returns {string}
 */
function camelCase (value) {
  return _.camelCase(value)
}

/**
 * Converts the value to-kebab-case.
 *
 * @param {string} value The string to convert
 * @returns {string}
 */
function kebabCase (value) {
  return _.kebabCase(value)
}

/**
 * Converts the value to_snake_case.
 *
 * @param {string} value The string to convert
 * @returns {string}
 */
function snakeCase (value) {
  return _.snakeCase(value)
}

/**
 * Converts the value TO UPPER CASE.
 *
 * @param {string} value The string to convert
 * @returns {string}
 */
function upperCase (value) {
  return _.upperCase(value)
}

/**
 * Converts the value to lower case.
 *
 * @param {string} value The string to convert
 * @returns {string}
 */
function lowerCase (value) {
  return _.lowerCase(value)
}

/**
 * Converts the value To start case.
 *
 * @param {string} value The string to convert
 * @returns {string}
 */
function startCase (value) {
  return _.startCase(value)
}

/**
 * Upcases the first character.
 *
 * @param {string} value The string to convert
 * @returns {string}
 */
function upperFirst (value) {
  return _.upperFirst(value)
}

/**
 * Lowercases the first character.
 *
 * @param {string} value The string to convert
 * @returns {string}
 */
function lowerFirst (value) {
  return _.lowerFirst(value)
}

/**
 * Converts the value ToPascalCase.
 *
 * @param {string} value The string to convert
 * @returns {string}
 */
function pascalCase (value) {
  return pipe(_.camelCase, _.upperFirst)(value)
}

/**
 * Pads a string with characters to a given length.
 *
 * @param {string} value The string to pad
 * @param {number} length How big to make this string
 * @param {string} character The character to use for extra space
 * @returns {string}
 */
function pad (value, length = 0, character = ' ') {
  return _.pad(value, length, character)
}

/**
 * Pads the front of a string to a given length.
 *
 * @param {string} value The string to pad
 * @param {number} length How big to make this string
 * @param {string} character The character to use for extra space
 * @returns {string}
 */
function padStart (value, length = 0, character = ' ') {
  return _.padStart(value, length, character)
}

/**
 * Pads the back of a string to a given length.
 *
 * @param {string} value The string to pad
 * @param {number} length How big to make this string
 * @param {string} character The character to use for extra space
 * @returns {string}
 */
function padEnd (value, length = 0, character = ' ') {
  return _.padEnd(value, length, character)
}

/**
 * Removes whitespace from the front & back.
 *
 * @param {string} value The string to trim.
 * @returns {string}
 */
function trim (value) {
  return _.trim(value)
}

/**
 * Removes whitespace from the front.
 *
 * @param {string} value The string to trim.
 * @returns {string}
 */
function trimStart (value) { return _.trimStart(value) }

/**
 * Removes whitespace from the back.
 *
 * @param {string} value The string to trim.
 * @returns {string}
 */
function trimEnd (value) { return _.trimEnd(value) }

/**
 * Repeats a character a number of times.
 *
 * @param {string} value The string to repeat.
 * @param {number} value The number of times to repeat
 * @returns {string}
 */
function repeat (value, count = 1) {
  return _.repeat(value, count)
}

module.exports = {
  identity,
  isBlank,
  isNotString,
  camelCase,
  kebabCase,
  snakeCase,
  upperCase,
  lowerCase,
  startCase,
  upperFirst,
  lowerFirst,
  pascalCase,
  pad,
  padStart,
  padEnd,
  trim,
  trimStart,
  trimEnd,
  repeat
}
