import { commandInfo, getVersion } from '../toolbox/meta-tools'
import { GluegunRunContext } from '../domain/run-context'

/**
 * Extension that lets you learn more about the currently running CLI.
 *
 * @param context The running context.
 */
export default function attach(context: GluegunRunContext): void {
  context.meta = {
    version: () => getVersion(context),
    commandInfo: () => commandInfo(context),
  }
  context.version = context.meta.version // easier access to version
}
