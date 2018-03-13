import { commandInfo, getVersion } from '../toolbox/meta-tools'
import { GluegunToolbox } from '../domain/toolbox'

export interface GluegunMeta {
  version: () => string
  commandInfo: () => string[][]
}

/**
 * Extension that lets you learn more about the currently running CLI.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: GluegunToolbox): void {
  const meta: GluegunMeta = {
    version: () => getVersion(toolbox),
    commandInfo: () => commandInfo(toolbox),
  }
  toolbox.meta = meta
}
