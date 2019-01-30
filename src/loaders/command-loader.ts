import * as path from 'path'
import { isNil, last, reject, is, takeLast } from '../toolbox/utils'
import { Command, GluegunCommand } from '../domain/command'
import { filesystem } from '../toolbox/filesystem-tools'
import { strings } from '../toolbox/string-tools'
import { loadModule } from './module-loader'
import { Options } from '../domain/options'

/**
 * Loads the command from the given file.
 *
 * @param file      The full path to the file to load.
 * @return The loaded command.
 */
export function loadCommandFromFile(file: string, options: Options = {}): Command {
  const command = new Command()

  // sanity check the input
  if (strings.isBlank(file)) {
    throw new Error(`Error: couldn't load command (file is blank): ${file}`)
  }

  // not a file?
  if (filesystem.isNotFile(file)) {
    throw new Error(`Error: couldn't load command (this isn't a file): ${file}`)
  }

  // remember the file
  command.file = file
  // default name is the name without the file extension

  command.name = (filesystem.inspect(file) as any).name.split('.')[0]

  // strip the extension from the end of the commandPath
  command.commandPath = (options.commandPath || last(file.split('commands' + path.sep)).split(path.sep)).map(f =>
    [`${command.name}.js`, `${command.name}.ts`].includes(f) ? command.name : f,
  )

  // if the last two elements of the commandPath are the same, remove the last one
  const lastElems = takeLast(2, command.commandPath)
  if (lastElems.length === 2 && lastElems[0] === lastElems[1]) {
    command.commandPath = command.commandPath.slice(0, -1)
  }

  // require in the module -- best chance to bomb is here
  let commandModule = loadModule(file)

  // if they use `export default` rather than `module.exports =`, we extract that
  commandModule = commandModule.default || commandModule

  // is it a valid commandModule?
  const valid = commandModule && typeof commandModule === 'object' && typeof commandModule.run === 'function'

  if (valid) {
    command.name = commandModule.name || last(command.commandPath)
    command.description = commandModule.description
    command.hidden = Boolean(commandModule.hidden)
    command.alias = reject(isNil, is(Array, commandModule.alias) ? commandModule.alias : [commandModule.alias])
    command.run = commandModule.run
  } else {
    throw new Error(`Error: Couldn't load command ${command.name} -- needs a "run" property with a function.`)
  }

  return command
}

export function loadCommandFromPreload(preload: GluegunCommand): Command {
  const command = new Command()
  command.name = preload.name
  command.description = preload.description
  command.hidden = Boolean(preload.hidden)
  command.alias = preload.alias
  command.run = preload.run
  command.file = null
  command.dashed = Boolean(preload.dashed)
  command.commandPath = preload.commandPath || [preload.name]
  return command
}
