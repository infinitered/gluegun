import { is, isEmpty, pipe } from 'ramda'

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
import { GluegunStrings } from './strings-types'

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
  return isNotString(value) || isEmpty(trim(value))
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
  return pipe(camelCase, upperFirst)(value) as string
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
