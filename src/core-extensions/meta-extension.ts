import { commandInfo, getVersion } from '../toolbox/meta-tools'
import { GluegunToolbox } from '../domain/toolbox'

/**
 * Extension that lets you learn more about the currently running CLI.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: GluegunToolbox): void {
  toolbox.meta = {
    version: () => getVersion(toolbox),
    commandInfo: () => commandInfo(toolbox),
  }
}
