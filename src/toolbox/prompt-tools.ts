import { GluegunPrompt } from './prompt-types'

let enquirer = null
function getEnquirer() {
  if (enquirer) return enquirer

  const Enquirer = require('enquirer')
  enquirer = new Enquirer()
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
   * @param message The message to display to the user.
   * @returns The true/false answer.
   */
  enquirer.confirm = async (message: string): Promise<boolean> => {
    const answers = await getEnquirer().ask({
      name: 'yesno',
      type: 'confirm',
      message,
    })
    return answers.yesno
  }

  return enquirer
}

/**
 * We're replicating the interface of Enquirer in order to
 * "lazy load" the package only if and when we actually are asked for it.
 * This results in a significant speed increase.
 */
const prompt: GluegunPrompt = {
  confirm: (message: string) => getEnquirer().confirm(message),
  ask: (questions: any) => getEnquirer().ask(questions),
  separator: () => getEnquirer().separator(),
}

export { prompt, GluegunPrompt }
