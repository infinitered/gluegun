// @flow
import { isNil, any, keys } from 'ramda'
import { isNotString, isBlank, throwWith } from './utils'
import type { Action, ActionArguments, ActionOptions } from '../types'

/**
 * Validates a type.  Throws an error if doesn't pass.
 *
 * @throws Error
 * @param {*} string - The type to validate.
 */
function validateType (value: string): void {
  throwWith('type is not a string', isNotString, value)
  throwWith('type cannot be blank', isBlank, value)
}

/**
 * Validates some arguments. Throws an error if there's an issue.
 *
 * @param {ActionArguments} value - The arguments to validate
 */
function validateArguments (value: ActionArguments): void {
  throwWith('options are null', isNil, value)
  throwWith('arguments must be strings', any(isNotString), keys(value))
}

/**
 * Validates some options. Throws an error if there's an issue.
 *
 * @param {ActionOptions} value - The options to validate
 */
function validateOptions (value: ActionOptions): void {
  throwWith('options are null', isNil, value)
  throwWith('options keys must be strings', any(isNotString), keys(value))
}

/**
 * Creates an action for the given type.
 *
 * @export
 * @param {string} type - The type of the action.
 * @param {ActionArguments} args - Any additional args.
 * @param {ActionOptions} opts - Any addtional options
 * @returns {Action}
 */
export function createAction (
  type: string,
  args?: ActionArguments,
  opts?: ActionOptions
): Action {
  // default arguments and options
  const theArguments = args || []
  const theOptions = opts || {}

  // make sure things are sane
  validateType(type)
  validateArguments(theArguments)
  validateOptions(theOptions)

  // create the action
  return {
    type,
    arguments: theArguments,
    options: theOptions
  }
}
