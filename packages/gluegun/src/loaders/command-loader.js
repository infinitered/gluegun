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
const Command = require('../domain/command')

/**
 * The load state of the command.
 *
 * none  = not loaded
 * ok    = the command is ready to go
 * error = an error has happened
 */
// export type CommandLoadState = 'none' | 'ok' | 'error'

/**
 * The error state.
 *
 * none        = no errors
 * input       = wierd input
 * missing     = the file is missing
 * badfile     = not a valid javascript file
 * badfunction = the function has not been exported or it's not a function
 */
// export type CommandErrorState = 'none' | 'input' | 'missing' | 'badfile' | 'badfunction'

/**
 * Loads the command from the given file.
 *
 * @param {string} file         The full path to the file to load.
 * @param {string} functionName An optional function name to load.
 */
function loadFromFile (file, functionName) {
  const command = new Command()

  // sanity check the input
  if (isBlank(file)) {
    command.loadState = 'error'
    command.errorState = 'input'
    return command
  }

  // remember the file & function
  command.file = file
  command.functionName = functionName

  // not a file?
  if (isNotFile(file)) {
    command.loadState = 'error'
    command.errorState = 'missing'
    return command
  }

  // default name is the name without the file extension
  command.name = head(split('.', jetpack.inspect(file).name))

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
    command.name = tokens.command || command.name
    command.description = tokens.description || command.description
    command.functionName = tokens.functionName || command.functionName

    // require in the module -- best chance to bomb is here
    const commandModule = loadModule(file)

    // should we try the default export?
    if (isNilOrEmpty(command.functionName)) {
      // are we expecting this?
      const valid = commandModule && typeof commandModule === 'function'

      if (valid) {
        command.loadState = 'ok'
        command.errorState = 'none'
        command.run = commandModule
      } else {
        command.loadState = 'error'
        command.errorState = 'badfunction'
      }
    } else {
      // we're after a named function
      const valid = commandModule &&
        commandModule[command.functionName] &&
        typeof commandModule[command.functionName] === 'function'

      if (valid) {
        command.loadState = 'ok'
        command.errorState = 'none'
        command.run = commandModule && commandModule[command.functionName]
      } else {
        command.loadState = 'error'
        command.errorState = 'badfunction'
      }
    }
  } catch (e) {
    command.exception = e
    command.loadState = 'error'
    command.errorState = 'badfile'
  }

  return command
}

module.exports = loadFromFile
