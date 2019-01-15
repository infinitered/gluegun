import { GluegunStrings } from './strings-types'
import { is } from './utils'

const camelCase = (...args) => require('lodash.camelcase')(...args)
const kebabCase = (...args) => require('lodash.kebabcase')(...args)
const lowerCase = (...args) => require('lodash.lowercase')(...args)
const lowerFirst = (...args) => require('lodash.lowerfirst')(...args)
const pad = (...args) => require('lodash.pad')(...args)
const padEnd = (...args) => require('lodash.padend')(...args)
const padStart = (...args) => require('lodash.padstart')(...args)
const repeat = (...args) => require('lodash.repeat')(...args)
const snakeCase = (...args) => require('lodash.snakecase')(...args)
const startCase = (...args) => require('lodash.startcase')(...args)
const trim = (...args) => require('lodash.trim')(...args)
const trimEnd = (...args) => require('lodash.trimend')(...args)
const trimStart = (...args) => require('lodash.trimstart')(...args)
const upperCase = (...args) => require('lodash.uppercase')(...args)
const upperFirst = (...args) => require('lodash.upperfirst')(...args)

const pluralize = (word: string, count?: number, inclusive?: boolean) => require('pluralize')(word, count, inclusive)
pluralize.plural = (word: string) => require('pluralize').plural(word)
pluralize.singular = (word: string) => require('pluralize').singular(word)
pluralize.addPluralRule = (rule: string | RegExp, replacement: string) =>
  require('pluralize').addPluralRule(rule, replacement)
pluralize.addSingularRule = (rule: string | RegExp, replacement: string) =>
  require('pluralize').addSingularRule(rule, replacement)

pluralize.addIrregularRule = (single: string, plural: string) => require('pluralize').addIrregularRule(single, plural)
pluralize.addUncountableRule = (word: string | RegExp) => require('pluralize').addUncountableRule(word)
pluralize.isPlural = (word: string) => require('pluralize').isPlural(word)
pluralize.isSingular = (word: string) => require('pluralize').isSingular(word)

/**
 * Is this not a string?
 *
 * @param value The value to check
 * @return True if it is not a string, otherwise false
 */
function isNotString(value: any): boolean {
  return !is(String, value)
}

/**
 * Is this value a blank string?
 *
 * @param value The value to check.
 * @returns True if it was, otherwise false.
 */
function isBlank(value: any): boolean {
  return isNotString(value) || trim(value) === ''
}

/**
 * Returns the value it is given
 *
 * @param value
 * @returns the value.
 */
function identity(value: any): any {
  return value
}

/**
 * Converts the value ToPascalCase.
 *
 * @param value The string to convert
 * @returns PascalCase string.
 */
function pascalCase(value: string): string {
  return upperFirst(camelCase(value))
}

export { GluegunStrings }

export const strings: GluegunStrings = {
  isNotString,
  isBlank,
  identity,
  pascalCase,
  camelCase,
  kebabCase,
  lowerCase,
  lowerFirst,
  pad,
  padEnd,
  padStart,
  repeat,
  snakeCase,
  startCase,
  trim,
  trimEnd,
  trimStart,
  upperCase,
  upperFirst,
  pluralize,
  plural: pluralize.plural,
  singular: pluralize.singular,
  addPluralRule: pluralize.addPluralRule,
  addSingularRule: pluralize.addSingularRule,
  addIrregularRule: pluralize.addIrregularRule,
  addUncountableRule: pluralize.addUncountableRule,
  isPlural: pluralize.isPlural,
  isSingular: pluralize.isSingular,
}
