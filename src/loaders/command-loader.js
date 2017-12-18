const { isNotFile } = require('../utils/filesystem-utils')
const { isBlank } = require('../utils/string-utils')
const loadModule = require('./module-loader')
const jetpack = require('fs-jetpack')
const { head, split, is, reject, isNil, takeLast, last } = require('ramda')
const Command = require('../domain/command')

/**
 * Loads the command from the given file.
 *
 * @param  {string} file      The full path to the file to load.
 * @return {Command}          The command in any condition
 */
function loadCommandFromFile (file, options = {}) {
  const command = new Command()

  // sanity check the input
  if (isBlank(file)) {
    throw new Error(`Error: couldn't load command (file is blank): ${file}`)
  }

  // not a file?
  if (isNotFile(file)) {
    throw new Error(`Error: couldn't load command (this isn't a file): ${file}`)
  }

  // remember the file
  command.file = file
  // default name is the name without the file extension
  command.name = head(split('.', jetpack.inspect(file).name))
  // strip the extension from the end of the commandPath
  command.commandPath = (options.commandPath || last(file.split('/commands/')).split('/')).map(
    f => ([`${command.name}.js`, `${command.name}.ts`].includes(f) ? command.name : f)
  )

  // if the last two elements of the commandPath are the same, remove the last one
  const lastElems = takeLast(2, command.commandPath)
  if (lastElems.length === 2 && lastElems[0] === lastElems[1]) {
    command.commandPath = command.commandPath.slice(0, -1)
  }

  // require in the module -- best chance to bomb is here
  const commandModule = loadModule(file)

  // are we expecting this?
  const valid =
    commandModule && typeof commandModule === 'object' && typeof commandModule.run === 'function'

  if (valid) {
    command.name = commandModule.name || last(command.commandPath)
    command.description = commandModule.description
    command.hidden = Boolean(commandModule.hidden)
    command.alias = reject(
      isNil,
      is(Array, commandModule.alias) ? commandModule.alias : [commandModule.alias]
    )
    command.run = commandModule.run
  } else {
    throw new Error(
      `Error: Couldn't load command ${command.name} -- needs a "run" property with a function.`
    )
  }

  return command
}

function loadCommandFromPreload (preload) {
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

module.exports = { loadCommandFromFile, loadCommandFromPreload }
