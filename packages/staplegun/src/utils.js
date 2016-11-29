// @flow
import { curry, when, pipe, trim, isEmpty, is, always } from 'ramda'

/**
 * Is this not a string?
 */
export function isNotString (value: any): bool {
  return !is(String, value)
}

/**
 * Is this value a blank string?
 */
export function isBlank (value: any): bool {
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
export function thrower (message?: string): void {
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
export const throwWith = curry(
  function throwWith (message: string, predicate: Function, value: any): void {
    when(predicate, () => thrower(message), value)
  }
)

