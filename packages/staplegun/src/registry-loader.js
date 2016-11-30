// @flow
import type { Registry } from '../types'
import jetpack from 'fs-jetpack'
import toml from 'toml'
import { throwWith, isBlank } from './utils'
import { all, has, keys, isArrayLike, length, complement, equals, isNil, values, is, test } from 'ramda'
import { createRegistry } from './registry'

const hasWhitespace = test(/\s/)
const notFile = complement(equals('file'))
const notArray = complement(isArrayLike)

/**
 * Loads a Registry from a TOML file and attempts to bring it to life!
 */
export function load (path: string): Registry {
  // sanity
  throwWith('path must not be empty', isBlank, path)

  // needs to exist
  throwWith(`file not found ${path}`, notFile, jetpack.exists(path))

  // read the file
  const contents = jetpack.read(path)
  throwWith(`unable to read file ${path}`, isNil, contents)

  // parse the toml
  const config = toml.parse(contents)

  // only 1 root key
  const rootKeyCount = length(keys(config))
  throwWith(`config should have only 1 root key`, complement(equals(1)), rootKeyCount)

  // only 1 root value
  const rootValueCount = length(values(config))
  throwWith(`config should have only 1 root key`, complement(equals(1)), rootValueCount)

  const rootValue = values(config)[0]
  // root value must be an object
  throwWith(`config root value should be an object`, complement(is(Object)), rootValue)

  // plugins must exist
  throwWith(`plugins key is missing`, complement(has('plugins')), rootValue)

  // plugins must be an array
  throwWith(`plugins key is not an array, it is ${typeof rootValue.plugins} ${rootValue.plugins}`, notArray, rootValue.plugins)

  // plugins must have only strings
  throwWith(`all plugins values should be strings ${rootValue.plugins}`, complement(all(is(String))), rootValue.plugins)

  // plugins array should only contain strings
  const namespace = keys(config)[0]

  // namespaces cannot have whitespace
  throwWith(`'${namespace}' is blank`, isBlank, namespace)

  // namespaces cannot have whitespace
  throwWith(`'${namespace}' is an invalid namespace as it has whitespace`, hasWhitespace, namespace)

  const registry = createRegistry(namespace)

  return registry
}
