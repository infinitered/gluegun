import { isNotFile } from '../toolbox/filesystem-tools'
import { isBlank } from '../toolbox/string-tools'

// try loading this module
function loadModule (path) {
  if (isBlank(path)) {
    throw new Error('path is required')
  }
  if (isNotFile(path)) {
    throw new Error(`${path} is not a file`)
  }

  require.resolve(path)
  return require(path)
}

export default loadModule
