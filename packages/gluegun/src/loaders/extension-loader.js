const { isNotFile } = require('../utils/filesystem-utils')
const { isBlank } = require('../utils/string-utils')
const loadModule = require('./module-loader')
const { isNilOrEmpty, startsWith } = require('ramdasauce')
const jetpack = require('fs-jetpack')
const {
  always,
  filter,
  fromPairs,
  head,
  join,
  map,
  pipe,
  replace,
  split,
  tail,
  trim,
  when
} = require('ramda')
const Extension = require('../domain/extension')

/**
 * Loads the extension from a file.
 *
 * @param {string} file         The full path to the file to load.
 */
function loadFromFile (file) {
  const extension = new Extension()

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
    // try reading in front matter
    const tokens = pipe(
      jetpack.read,                       // read the file
      when(isNilOrEmpty, always('')),     // default to blank
      split('\n'),                        // split on new lines
      map(trim),                          // trim
      filter(startsWith('//')),           // only comments
      map(replace(/^\/\/\s*/, '')),       // remove comments
      map(trim),                          // trim again
      map(split(/\s/)),                   // split on whitespace
      map(x => [                          // turn into a 2d array
        pipe(head, tail)(x),              // 0 = remove the @
        pipe(tail, join(' '), trim)(x)    // join & trim the reset
      ]),
      fromPairs                           // as an object
    )(file)

    // let's override if we've found these tokens
    extension.name = tokens.extension || extension.name
    extension.description = tokens.description || extension.description

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
