const { isNotFile } = require('../utils/filesystem-utils')
const { isBlank } = require('../utils/string-utils')
const loadModule = require('./module-loader')
const jetpack = require('fs-jetpack')
const { head, split } = require('ramda')
const Command = require('../domain/command')

/**
 * Loads the command from the given file.
 *
 * @param  {string} file      The full path to the file to load.
 * @return {Command}          The command in any condition
 */
function loadFromFile (file, options = {}) {
  const command = new Command()

  // sanity check the input
  if (isBlank(file)) {
    throw new Error(`Error: couldn't load command (file is blank): ${file}`)
  }

  // remember the file & function
  command.file = file

  // not a file?
  if (isNotFile(file)) {
    throw new Error(`Error: couldn't load command (this isn't a file): ${file}`)
  }

  // default name is the name without the file extension
  command.name = head(split('.', jetpack.inspect(file).name))

  // require in the module -- best chance to bomb is here
  const commandModule = loadModule(file)

  // are we expecting this?
  const valid = commandModule && typeof commandModule === 'object' && typeof commandModule.run === 'function'

  if (valid) {
    command.name = commandModule.name
    command.description = commandModule.description
    command.hidden = commandModule.hidden
    command.run = commandModule.run
  } else {
    throw new Error(`Error: Couldn't load command ${command.name} -- needs a "run" property with a function.`)
  }

  return command
}

module.exports = loadFromFile
