import RunContext from './run-context'

/**
 * An extension will add functionality to the context that each command will receive.
 */
export default class Extension {
  public name?: string
  public description?: string
  public file?: string
  public setup?: (context: RunContext) => void

  constructor () {
    this.name = null
    this.description = null
    this.file = null
    this.setup = null
  }
}
