const Enquirer = require('enquirer')

/**
 * Provides user input prompts via enquirer.js.
 *
 * @return {Function} A function to attach to the context.
 */
function attach () {
  const enquirer = new Enquirer()
  enquirer.register('list', require('prompt-list'))
  enquirer.register('rawlist', require('prompt-rawlist'))
  enquirer.register('confirm', require('prompt-confirm'))
  enquirer.register('expand', require('prompt-expand'))
  enquirer.register('checkbox', require('prompt-checkbox'))
  enquirer.register('radio', require('prompt-radio'))
  enquirer.register('password', require('prompt-password'))
  enquirer.register('question', require('prompt-question'))
  enquirer.register('autocomplete', require('prompt-autocomplete'))
  return enquirer
}

module.exports = attach
