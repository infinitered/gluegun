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
    this.run = null
    this.loadState = 'none'
    this.errorState = 'none'
    this.exception = null
    this.hidden = false
  }
}

module.exports = Command
