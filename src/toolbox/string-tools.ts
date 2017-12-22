import * as camelCase from 'lodash.camelcase'
import * as kebabCase from 'lodash.kebabcase'
import * as lowerCase from 'lodash.lowercase'
import * as lowerFirst from 'lodash.lowerfirst'
import * as pad from 'lodash.pad'
import * as padEnd from 'lodash.padend'
import * as padStart from 'lodash.padstart'
import * as repeat from 'lodash.repeat'
import * as snakeCase from 'lodash.snakecase'
import * as startCase from 'lodash.startcase'
import * as trim from 'lodash.trim'
import * as trimEnd from 'lodash.trimend'
import * as trimStart from 'lodash.trimstart'
import * as upperCase from 'lodash.uppercase'
import * as upperFirst from 'lodash.upperfirst'
import * as pluralize from 'pluralize'
import { is, isEmpty, pipe } from 'ramda'

const {
  plural,
  singular,
  addPluralRule,
  addSingularRule,
  addIrregularRule,
  addUncountableRule,
  isPlural,
  isSingular,
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
const isBlank = (value: any) => {
  return isNotString(value) || isEmpty(trim(value))
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

export {
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
  isSingular,
}
