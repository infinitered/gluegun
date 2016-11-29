import autobind from 'autobind-decorator'

/**
 * The staplegun runtime environment.
 */
@autobind
class Environment {

  test = ''

  /**
   * Creates a new runtime environment in which to execute commands
   */
  constructor () {
    this.test = 'hey'
  }

  /**
   * Is autobind working?
   */
  isHey () {
    return this.test === 'hey'
  }

}

export default Environment
