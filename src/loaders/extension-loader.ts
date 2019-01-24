import { Extension } from '../domain/extension'
import { filesystem } from '../toolbox/filesystem-tools'
import { strings } from '../toolbox/string-tools'
import { loadModule } from './module-loader'
import { EmptyToolbox, Toolbox } from '../domain/toolbox'

/**
 * Loads the extension from a file.
 *
 * @param file The full path to the file to load.
 * @param options Options, such as
 */
export function loadExtensionFromFile(file: string, options = {}): Extension {
  const extension = new Extension()

  // sanity check the input
  if (strings.isBlank(file)) {
    throw new Error(`Error: couldn't load extension (file is blank): ${file}`)
  }

  extension.file = file

  // not a file?
  if (filesystem.isNotFile(file)) {
    throw new Error(`Error: couldn't load command (not a file): ${file}`)
  }

  // default is the name of the file without the extension
  extension.name = (filesystem.inspect(file) as any).name.split('.')[0]

  // require in the module -- best chance to bomb is here
  let extensionModule = loadModule(file)

  // if they use `export default` rather than `module.exports =`, we extract that
  extensionModule = extensionModule.default || extensionModule

  // should we try the default export?
  const valid = extensionModule && typeof extensionModule === 'function'

  if (valid) {
    extension.setup = (toolbox: EmptyToolbox) => extensionModule(toolbox as Toolbox)
  } else {
    throw new Error(`Error: couldn't load ${extension.name}. Expected a function, got ${extensionModule}.`)
  }

  return extension
}
