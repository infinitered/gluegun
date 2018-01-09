import { commandInfo, getVersion } from '../toolbox/meta-tools'
import { RunContext } from '../domain/run-context'

/**
 * Extension that lets you learn more about the currently running CLI.
 *
 * @param  {RunContext} context The running context.
 */
export default function attach(context: RunContext) {
  context.meta = {
    version: () => getVersion(context),
    commandInfo: () => commandInfo(context),
  }
  context.version = context.meta.version // easier access to version
}
