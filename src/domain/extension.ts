import { RunContext } from './run-context'

/**
 * An extension will add functionality to the context that each command will receive.
 */
export class Extension {
  /** The name of the extension. */
  public name?: string = null
  /** The description. */
  public description?: string = null
  /** The file this extension comes from. */
  public file?: string = null
  /** The function used to attach functionality to the context. */
  public setup?: (context: RunContext) => void = null
}
