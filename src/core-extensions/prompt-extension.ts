import * as Enquirer from 'enquirer'
import { RunContext } from '../domain/run-context'

/**
 * Provides user input prompts via enquirer.js.
 *
 * @param context The running context.
 */
export default function attach(context: RunContext): void {
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
   * @param message The message to display to the user.
   * @returns The true/false answer.
   */
  const confirm = async (message: string): Promise<boolean> => {
    const answers = await enquirer.ask({
      name: 'yesno',
      type: 'confirm',
      message,
    })
    return answers.yesno
  }

  // attach our helpers
  enquirer.confirm = confirm

  context.prompt = enquirer
}
