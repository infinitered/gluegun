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

export const leftPad = curry((num, fill, str) => {
  const again = max(0, num - str.length)
  return join('', repeat(fill, again)) + str
})

export const rightPad = curry((num, fill, str) => {
  const again = max(0, num - str.length)
  return str + join('', repeat(fill, again))
})

/**
 * Is this a file?
 */
export const isFile = file => jetpack.exists(file) === 'file'

/**
 * Is this not a file?
 */
export const isNotFile = complement(isFile)

/**
 * Is this a directory?
 */
export const isDirectory = dir => jetpack.exists(dir) === 'dir'

/**
 * Is this not a directory?
 */
export const isNotDirectory = complement(isDirectory)
