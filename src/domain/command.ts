import { RunContext } from './run-context'

export interface GluegunCommand {
  name?: string
  description?: string
  run: (context: RunContext) => void
  hidden?: boolean
  commandPath?: string[]
  alias?: string | string[]
  dashed?: boolean
}

/**
 * A command is user-callable function that runs stuff.
 */
export class Command implements GluegunCommand {
  public name
  public description
  public file
  public run
  public hidden
  public commandPath
  public alias
  public dashed

  constructor() {
    this.name = null
    this.description = null
    this.file = null
    this.run = null
    this.hidden = false
    this.commandPath = null
    this.alias = []
    this.dashed = false
  }

  get aliases(): string[] {
    if (!this.alias) {
      return []
    }
    return Array.isArray(this.alias) ? this.alias : [this.alias]
  }

  public hasAlias() {
    return this.aliases.length > 0
  }

  /**
   * Checks if a given alias matches with this command's aliases, including name.
   * Can take a list of aliases too and check them all.
   *
   * @param {string|string[]} alias
   */
  public matchesAlias(alias) {
    const aliases = Array.isArray(alias) ? alias : [alias]
    return aliases.find(a => this.name === a || this.aliases.includes(a))
  }
}
