const inquirer = require('inquirer')

// the askYesNo defaults
const NO = 'No'
const YES = 'Yes'

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

  /**
   * Asks a question with a yes or no outcome.
   *
   * @param  {string} message The message to display
   * @param  {{}} options     The prompt configuration options.
   * @return {bool}           The user's choice.
   */
  async function askYesOrNo (message, options = {}) {
    const answer = await ask({
      type: 'list',
      name: 'yesOrNo',
      message: message,
      choices: [
        { name: options.yes || YES, value: true },
        { name: options.no || NO, value: false }
      ]
    })
    return answer.yesOrNo
  }

  return {
    ask,
    separator,
    askYesOrNo
  }
}

module.exports = attach
