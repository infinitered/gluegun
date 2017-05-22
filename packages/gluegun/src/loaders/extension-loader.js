const { isNotFile } = require('../utils/filesystem-utils')
const { isBlank } = require('../utils/string-utils')
const loadModule = require('./module-loader')
const findTokens = require('./find-tokens')
const jetpack = require('fs-jetpack')
const { head, split } = require('ramda')
const Extension = require('../domain/extension')

/**
 * Loads the extension from a file.
 *
 * @param {string} file         The full path to the file to load.
 */
function loadFromFile (file, options = {}) {
  const extension = new Extension()

  const extensionNameToken = options.extensionNameToken ||
    'gluegunExtensionName'

  // sanity check the input
  if (isBlank(file)) {
    extension.loadState = 'error'
    extension.errorState = 'input'
    return extension
  }

  extension.file = file

  // not a file?
  if (isNotFile(file)) {
    extension.loadState = 'error'
    extension.errorState = 'missing'
    return extension
  }

  // default is the name of the file without the extension
  extension.name = head(split('.', jetpack.inspect(file).name))

  // let's load
  try {
    // try reading in tokens embedded in the file
    const tokens = findTokens(jetpack.read(file) || '', [extensionNameToken])

    // let's override if we've found these tokens
    extension.name = tokens[extensionNameToken] || extension.name

    // require in the module -- best chance to bomb is here
    const extensionModule = loadModule(file)

    // should we try the default export?
    const valid = extensionModule && typeof extensionModule === 'function'

    if (valid) {
      extension.loadState = 'ok'
      extension.errorState = 'none'
      extension.setup = extensionModule
    } else {
      extension.loadState = 'error'
      extension.errorState = 'badfunction'
    }
  } catch (e) {
    extension.exception = e
    extension.loadState = 'error'
    extension.errorState = 'badfile'
  }

  return extension
}

module.exports = loadFromFile
