const { isBlank, throwWith, isNotFile } = require('./utils')

// try loading this module
function loadModule (path) {
  throwWith('path is required', isBlank, path)
  throwWith(`${path} is not a file`, isNotFile, path)

  require.resolve(path)
  return require(path)
}

module.exports = loadModule
