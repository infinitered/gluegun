// @flow
import { curry, when, pipe, trim, isEmpty, is, always, complement, max, join, repeat } from 'ramda'
import jetpack from 'fs-jetpack'

/**
 * The opposite of is.  Great restraint made me not call this: aint.
 */
export const isnt = complement(is)

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

/**
 * Expands a string to fit within a certain size by filling
 * characters to the front.
 *
 * @param {number} length The size to fill to
 * @param {string} fill   The character to fill with
 * @param {string} value  The string we want to fill
 */
export const leftPad = curry((length, fill, value) => {
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
export const rightPad = curry((length, fill, value) => {
  const again = max(0, length - value.length)
  return value + join('', repeat(fill, again))
})

/**
 * Is this a file?
 */
export const isFile = (file: string) => jetpack.exists(file) === 'file'

/**
 * Is this not a file?
 */
export const isNotFile = complement(isFile)

/**
 * Is this a directory?
 */
export const isDirectory = (dir: string) => jetpack.exists(dir) === 'dir'

/**
 * Is this not a directory?
 */
export const isNotDirectory = complement(isDirectory)
