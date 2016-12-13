class RunContext {

  constructor () {
    /**
     * The full arguments (including command name)
     */
    this.fullArguments = null

    /**
     * The parsed arguments to pass to the command
     */
    this.arguments = null

    /**
     * The string version of the arguments for convenience.
     */
    this.stringArguments = null

    /**
     * Any additional options
     */
    this.options = null

    /**
     * The result of the run command.
     */
    this.result = null

    /**
     * An error, if any.
     */
    this.error = null

    /**
     * The configuration.  A mashup of defaults + overrides.
     */
    this.config = null
  }

}

module.exports = RunContext
