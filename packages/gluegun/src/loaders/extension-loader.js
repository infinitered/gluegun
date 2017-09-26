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
    throw new Error(`Error: couldn't load extension (file is blank): ${file}`)
  }

  extension.file = file

  // not a file?
  if (isNotFile(file)) {
    throw new Error(`Error: couldn't load command (not a file): ${file}`)
  }

  // default is the name of the file without the extension
  extension.name = head(split('.', jetpack.inspect(file).name))

  // try reading in tokens embedded in the file
  const tokens = findTokens(jetpack.read(file) || '', [extensionNameToken])

  // let's override if we've found these tokens
  extension.name = tokens[extensionNameToken] || extension.name

  // require in the module -- best chance to bomb is here
  const extensionModule = loadModule(file)

  // should we try the default export?
  const valid = extensionModule && typeof extensionModule === 'function'

  if (valid) {
    extension.setup = extensionModule
  } else {
    throw new Error(`Error: couldn't load ${extension.name}. Expected a function, got ${commandModule}.`)
  }

  return extension
}

module.exports = loadFromFile
