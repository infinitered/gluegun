import { EmptyToolbox } from './toolbox'

/**
 * An extension will add functionality to the toolbox that each command will receive.
 */
export class Extension {
  /** The name of the extension. */
  public name?: string = null
  /** The description. */
  public description?: string = null
  /** The file this extension comes from. */
  public file?: string = null
  /** The function used to attach functionality to the toolbox. */
  public setup?: (toolbox: EmptyToolbox) => void | Promise<void> = null
}
