// @flow
import { isNil, any, keys } from 'ramda'
import { isNotString, isBlank, throwWith } from './utils'
import type { Action, ActionArguments, ActionOptions } from '../types'

/**
 * Creates an action for the given type.
 */
export function createAction (
  type: string,
  args?: ActionArguments = [],
  options?: ActionOptions = {}
): Action {
  // sanity
  throwWith('type is not a string', isNotString, type)
  throwWith('type cannot be blank', isBlank, type)
  throwWith('options are null', isNil, args)
  throwWith('arguments must be strings', any(isNotString), keys(args))
  throwWith('options are null', isNil, options)
  throwWith('options keys must be strings', any(isNotString), keys(options))

  // create the action
  return { type, arguments: args, options }
}
