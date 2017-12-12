const { always, is, isEmpty, pipe, when } = require('ramda')
const camelCase = require('lodash.camelcase')
const kebabCase = require('lodash.kebabcase')
const snakeCase = require('lodash.snakecase')
const upperCase = require('lodash.uppercase')
const lowerCase = require('lodash.lowercase')
const startCase = require('lodash.startcase')
const upperFirst = require('lodash.upperfirst')
const lowerFirst = require('lodash.lowerfirst')
const pad = require('lodash.pad')
const padStart = require('lodash.padstart')
const padEnd = require('lodash.padend')
const trim = require('lodash.trim')
const trimStart = require('lodash.trimstart')
const trimEnd = require('lodash.trimend')
const repeat = require('lodash.repeat')
const pluralize = require('pluralize')
const {
  plural,
  singular,
  addPluralRule,
  addSingularRule,
  addIrregularRule,
  addUncountableRule,
  isPlural,
  isSingular
} = pluralize

/**
 * Is this not a string?
 *
 * @param  {any}     value The value to check
 * @return {boolean}       True if it is not a string, otherwise false
 */
const isNotString = value => {
  return !is(String, value)
}

/**
 * Is this value a blank string?
 *
 * @param   {any}     value The value to check.
 * @returns {boolean}       True if it was, otherwise false.
 */
const isBlank = value => {
  const check = pipe(when(isNotString, always('')), trim, isEmpty)

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
 * Converts the value ToPascalCase.
 *
 * @param {string} value The string to convert
 * @returns {string}
 */
function pascalCase (value) {
  return pipe(camelCase, upperFirst)(value)
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
  repeat,
  pluralize,
  plural,
  singular,
  addPluralRule,
  addSingularRule,
  addIrregularRule,
  addUncountableRule,
  isPlural,
  isSingular
}
