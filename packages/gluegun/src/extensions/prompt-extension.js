const inquirer = require('inquirer')


/**
 * Provides user input prompts via inquirer.js.
 *
 * @return {Function} A function to attach to the context.
 */
function attach () {
  // rename the prompt so we don't have prompt.prompt
  const ask = inquirer.prompt

  // make the separator available
  const separator = line => new inquirer.Separator(line)

  // a helper to ask to overwrite
  async function askToOverwrite (message = 'Overwrite existing file?') {
    const { overwrite } = await ask({
      type: 'list',
      name: 'overwrite',
      message: message,
      choices: [
        { name: 'Yes', value: true },
        { name: 'No', value: false }
      ]
    })
    return overwrite
  }

  return { ask, separator, askToOverwrite }
}

module.exports = attach
