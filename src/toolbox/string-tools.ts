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

export { camelCase }
export { kebabCase }
export { lowerCase }
export { lowerFirst }
export { pad }
export { padEnd }
export { padStart }
export { repeat }
export { snakeCase }
export { startCase }
export { trim }
export { trimEnd }
export { trimStart }
export { upperCase }
export { upperFirst }

export { pluralize }
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
 * @param value The value to check
 * @return True if it is not a string, otherwise false
 */
export function isNotString(value: any): boolean {
  return !is(String, value)
}

/**
 * Is this value a blank string?
 *
 * @param value The value to check.
 * @returns True if it was, otherwise false.
 */
export function isBlank(value: any): boolean {
  return isNotString(value) || isEmpty(trim(value))
}

/**
 * Returns the value it is given
 *
 * @param value
 * @returns the value.
 */
export function identity(value: any): any {
  return value
}

/**
 * Converts the value ToPascalCase.
 *
 * @param value The string to convert
 * @returns PascalCase string.
 */
export function pascalCase(value: string): string {
  return pipe(camelCase, upperFirst)(value) as string
}
