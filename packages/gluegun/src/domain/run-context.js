class RunContext {
  constructor () {
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
    this.config = {}

    /**
     *  The parameters like the command line options and arguments.
     */
    this.parameters = {}
  }
}

module.exports = RunContext
