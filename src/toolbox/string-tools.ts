import { is, isEmpty, pipe } from 'ramda'

import * as lodashCamelCase from 'lodash.camelcase'
import * as lodashKebabCase from 'lodash.kebabcase'
import * as lodashLowerCase from 'lodash.lowercase'
import * as lodashLowerFirst from 'lodash.lowerfirst'
import * as lodashPad from 'lodash.pad'
import * as lodashPadEnd from 'lodash.padend'
import * as lodashPadStart from 'lodash.padstart'
import * as lodashRepeat from 'lodash.repeat'
import * as lodashSnakeCase from 'lodash.snakecase'
import * as lodashStartCase from 'lodash.startcase'
import * as lodashTrim from 'lodash.trim'
import * as lodashTrimEnd from 'lodash.trimend'
import * as lodashTrimStart from 'lodash.trimstart'
import * as lodashUpperCase from 'lodash.uppercase'
import * as lodashUpperFirst from 'lodash.upperfirst'
import * as pluralizeModule from 'pluralize'

export const camelCase = lodashCamelCase
export const kebabCase = lodashKebabCase
export const lowerCase = lodashLowerCase
export const lowerFirst = lodashLowerFirst
export const pad = lodashPad
export const padEnd = lodashPadEnd
export const padStart = lodashPadStart
export const repeat = lodashRepeat
export const snakeCase = lodashSnakeCase
export const startCase = lodashStartCase
export const trim = lodashTrim
export const trimEnd = lodashTrimEnd
export const trimStart = lodashTrimStart
export const upperCase = lodashUpperCase
export const upperFirst = lodashUpperFirst

export const pluralize = pluralizeModule
export const plural = pluralize.plural
export const singular = pluralize.singular
export const addPluralRule = pluralize.addPluralRule
export const addSingularRule = pluralize.addSingularRule
export const addIrregularRule = pluralize.addIrregularRule
export const addUncountableRule = pluralize.addUncountableRule
export const isPlural = pluralize.isPlural
export const isSingular = pluralize.isSingular

/**
 * Is this not a string?
 *
 * @param  {any}     value The value to check
 * @return {boolean}       True if it is not a string, otherwise false
 */
export const isNotString = value => {
  return !is(String, value)
}

/**
 * Is this value a blank string?
 *
 * @param   {any}     value The value to check.
 * @returns {boolean}       True if it was, otherwise false.
 */
export const isBlank = (value: any) => {
  return isNotString(value) || isEmpty(trim(value))
}

/**
 * Returns the value it is given
 *
 * @param {any} value
 * @returns     the value.
 */
export function identity(value) {
  return value
}

/**
 * Converts the value ToPascalCase.
 *
 * @param {string} value The string to convert
 * @returns {string}
 */
export function pascalCase(value) {
  return pipe(camelCase, upperFirst)(value)
}
