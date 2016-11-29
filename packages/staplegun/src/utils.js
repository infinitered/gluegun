// @flow
import { when, pipe, trim, isEmpty, is, always } from 'ramda'

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
export function thrower (message: String): void {
  throw new Error(message)
}
