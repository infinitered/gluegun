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

  /**
   * Returns normalized list of aliases.
   *
   * @returns list of aliases.
   */
  get aliases(): string[] {
    if (!this.alias) {
      return []
    }
    return Array.isArray(this.alias) ? this.alias : [this.alias]
  }

  /**
   * Checks if the command has any aliases at all.
   *
   * @returns whether the command has any aliases
   */
  public hasAlias(): boolean {
    return this.aliases.length > 0
  }

  /**
   * Checks if a given alias matches with this command's aliases, including name.
   * Can take a list of aliases too and check them all.
   *
   * @param alias
   * @returns whether the alias[es] matches
   */
  public matchesAlias(alias: string | string[]): boolean {
    const aliases = Array.isArray(alias) ? alias : [alias]
    return Boolean(aliases.find(a => this.name === a || this.aliases.includes(a)))
  }
}
