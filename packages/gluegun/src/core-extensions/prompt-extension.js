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

  /**
   * Asks a question with a yes or no outcome.
   *
   * @param  {string} message The message to display
   * @return {bool}           The user's choice.
   */
  async function confirm (message, options = {}) {
    const answer = await ask({
      type: 'confirm',
      name: 'yesOrNo',
      message: message
    })
    return answer.yesOrNo
  }

  return {
    ask,
    separator,
    confirm
  }
}

module.exports = attach
