import { GluegunToolbox } from '../domain/toolbox'
import { buildGenerate } from '../toolbox/template-tools'

/**
 * Builds the code generation feature.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: GluegunToolbox): void {
  const generate = buildGenerate(toolbox)
  toolbox.template = { generate }
}
