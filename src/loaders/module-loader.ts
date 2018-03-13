import { filesystem } from '../toolbox/filesystem-tools'
import { strings } from '../toolbox/string-tools'

// try loading this module
export function loadModule(path) {
  if (strings.isBlank(path)) {
    throw new Error('path is required')
  }
  if (filesystem.isNotFile(path)) {
    throw new Error(`${path} is not a file`)
  }

  require.resolve(path)
  return require(path)
}
