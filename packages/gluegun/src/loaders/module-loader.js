const { isBlank } = require('../utils/string-utils')
const { isNotFile } = require('../utils/filesystem-utils')
const throwWhen = require('../utils/throw-when')

// try loading this module
function loadModule (path) {
  throwWhen('path is required', isBlank, path)
  throwWhen(`${path} is not a file`, isNotFile, path)

  require.resolve(path)
  return require(path)
}

module.exports = loadModule
