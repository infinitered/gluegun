// @flow
import autobind from 'autobind-decorator'
import { isNotFile, isBlank } from './utils'
import loadModule from './module-loader'
import { isNilOrEmpty, startsWith } from 'ramdasauce'
import jetpack from 'fs-jetpack'
import { has, toLower, join, head, tail, replace, filter, when, always, pipe, split, trim, map, fromPairs } from 'ramda'

/**
 * The load state of the command.
 *
 * none  = not loaded
 * ok    = the command is ready to go
 * error = an error has happened
 */
export type CommandLoadState = 'none' | 'ok' | 'error'

/**
 * The error state.
 *
 * none        = no errors
 * input       = wierd input
 * missing     = the file is missing
 * badfile     = not a valid javascript file
 * badfunction = the function has not been exported or it's not a function
 */
export type CommandErrorState = 'none' | 'input' | 'missing' | 'badfile' | 'badfunction'

/**
 * A command is user-callable function that runs stuff.
 */
@autobind
class Command {

  /**
   * How the user invokes it.
   */
  name : ?string

  /**
   * A human friendly explanation.
   */
  description: ?string

  /**
   * The relative path to the command from the plugin directory.
   */
  file: ?string

  /**
   * The name of the function exported from the file.
   */
  functionName: ?string

  /**
   * The function to run that has been loaded.
   */
  run: ?Function

  /**
   * The stage of loading.
   */
  loadState: CommandLoadState = 'none'

  /**
   * The error state
   */
  errorState: CommandErrorState = 'none'

  /**
   * Loads the command from the given file. We try not to bubble errors up from here.
   */
  loadFromFile (file: string, functionName: ?string): void {
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

      const mod: ?Function = loadModule(file)

      // should we try the default export?
      if (isNilOrEmpty(this.functionName)) {
        // are we expecting this?
        const valid = mod && mod.default && typeof mod.default === 'function'

        if (valid) {
          this.loadState = 'ok'
          this.errorState = 'none'
          this.run = mod && mod.default
        } else {
          this.loadState = 'error'
          this.errorState = 'badfunction'
        }
      } else {
        // we're after a named function
        const valid = mod && mod[this.functionName] && typeof mod[this.functionName] === 'function'

        if (valid) {
          this.loadState = 'ok'
          this.errorState = 'none'
          this.run = mod && mod[this.functionName]
        } else {
          this.loadState = 'error'
          this.errorState = 'badfunction'
        }
      }
    } catch (e) {
      this.loadState = 'error'
      this.errorState = 'badfile'
    }
  }

}

export default Command
