const Enquirer = require('enquirer')

/**
 * Provides user input prompts via enquirer.js.
 *
 * @param  {RunContext} context The running context.
 */
function attach (context) {
  const enquirer = new Enquirer()
  enquirer.register('list', require('prompt-list'))
  enquirer.register('rawlist', require('prompt-rawlist'))
  enquirer.register('confirm', require('prompt-confirm'))
  enquirer.register('expand', require('prompt-expand'))
  enquirer.register('checkbox', require('prompt-checkbox'))
  enquirer.register('radio', require('prompt-radio'))
  enquirer.register('password', require('prompt-password'))
  enquirer.register('question', require('prompt-question'))
  enquirer.register('autocomplete', require('prompt-autocompletion'))

  /**
   * A yes/no question.
   *
   * @param {string} message The message to display to the user.
   * @returns {bool}         The true/false answer.
   */
  const confirm = async message => {
    const answers = await enquirer.ask({
      name: 'yesno',
      type: 'confirm',
      message
    })
    return answers.yesno
  }

  // attach our helpers
  enquirer.confirm = confirm

  context.prompt = enquirer
}

module.exports = attach
