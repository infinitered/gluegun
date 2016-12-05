const autobind = require('autobind-decorator')
const { isNotFile, isBlank } = require('./utils')
const loadModule = require('./module-loader')
const { isNilOrEmpty, startsWith } = require('ramdasauce')
const jetpack = require('fs-jetpack')
const { join, head, tail, replace, filter, when, always, pipe, split, trim, map, fromPairs } = require('ramda')

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
 * A command is user-callable function that runs stuff.
 */
class Command {

  constructor () {
    this.name = null
    this.description = null
    this.file = null
    this.function = null
    this.run = null
    this.loadState = 'none'
    this.errorState = 'none'
  }

  /**
   * Loads the command from the given file. We try not to bubble errors up from here.
   */
  loadFromFile (file, functionName) {
    // reset state
    this.run = null
    this.loadState = 'none'

    // sanity check
    if (isBlank(file)) {
      this.loadState = 'error'
      this.errorState = 'input'
      return
    }

    // remember the file & function
    this.file = file
    this.functionName = functionName

    // not a file?
    if (isNotFile(file)) {
      this.loadState = 'error'
      this.errorState = 'missing'
      return
    }

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
      this.name = tokens.command || this.name
      this.description = tokens.description || this.description
      this.functionName = tokens.functionName || this.functionName

      const commandModule = loadModule(file)

      // should we try the default export?
      if (isNilOrEmpty(this.functionName)) {
        // are we expecting this?
        const valid = commandModule && typeof commandModule === 'function'

        if (valid) {
          this.loadState = 'ok'
          this.errorState = 'none'
          this.run = commandModule
        } else {
          this.loadState = 'error'
          this.errorState = 'badfunction'
        }
      } else {
        // we're after a named function
        const valid = commandModule && commandModule[this.functionName] && typeof commandModule[this.functionName] === 'function'
        if (valid) {
          this.loadState = 'ok'
          this.errorState = 'none'
          this.run = commandModule && commandModule[this.functionName]
        } else {
          this.loadState = 'error'
          this.errorState = 'badfunction'
        }
      }
    } catch (e) {
      console.log(e.message) // TODO: need to surface this error for debugging
      this.loadState = 'error'
      this.errorState = 'badfile'
    }
  }

}

module.exports = autobind(Command)
