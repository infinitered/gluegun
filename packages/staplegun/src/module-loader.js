// @flow
import { isBlank, throwWith, isNotFile } from './utils'

// try loading this module
function loadModule (path: string): any|void {
  throwWith('path is required', isBlank, path)
  throwWith(`${path} is not a file`, isNotFile, path)

  require.resolve(path)
  return require(path)
}

export default loadModule
