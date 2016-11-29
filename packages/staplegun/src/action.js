// @flow
import { when, T, F, cond, always } from 'ramda'
import { isNotString, isBlank, thrower } from './utils'
import type { Action, ActionArguments, ActionOptions } from '../types'

/**
 * Validates a type.  Throws an error if doesn't pass.
 *
 * @throws Error
 * @param {*} string The type to validate.
 */
export function validateType (value: string): void {
  when(
    cond([
      [isNotString, always('not a string')],
      [isBlank, always('cannot be blank')],
      [T, F]
    ]),
    thrower,
    value
  )
}

/**
 * Creates an action for the given type.
 *
 * @export
 * @param {string} type
 * @param {ActionArguments} args
 * @param {ActionOptions} opts
 * @returns {Action}
 */
export function createAction (
  type: string,
  args: ActionArguments,
  opts: ActionOptions
): Action {
  validateType(type)

  return { type, arguments: [], options: {} }
}
