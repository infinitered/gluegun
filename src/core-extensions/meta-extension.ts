import { commandInfo, getVersion, checkForUpdate, getPackageJSON } from '../toolbox/meta-tools'
import { GluegunToolbox } from '../domain/toolbox'
import { PackageJSON } from '../toolbox/meta-types'

export interface GluegunMeta {
  src: string | void
  version: () => string
  packageJSON: () => PackageJSON
  commandInfo: () => string[][]
  checkForUpdate: () => Promise<boolean | string>
}

/**
 * Extension that lets you learn more about the currently running CLI.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: GluegunToolbox): void {
  const meta: GluegunMeta = {
    src: toolbox.runtime && toolbox.runtime.defaultPlugin && toolbox.runtime.defaultPlugin.directory,
    version: () => getVersion(toolbox),
    packageJSON: () => getPackageJSON(toolbox),
    commandInfo: () => commandInfo(toolbox),
    checkForUpdate: () => checkForUpdate(toolbox),
  }
  toolbox.meta = meta
}
