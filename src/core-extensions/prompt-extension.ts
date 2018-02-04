import * as Enquirer from 'enquirer'
import { RunContext } from '../domain/run-context'
import * as promptList from 'prompt-list'
import * as promptRawlist from 'prompt-rawlist'
import * as promptConfirm from 'prompt-confirm'
import * as promptExpand from 'prompt-expand'
import * as promptCheckbox from 'prompt-checkbox'
import * as promptRadio from 'prompt-radio'
import * as promptPassword from 'prompt-password'
import * as promptQuestion from 'prompt-question'
import * as promptAutocompletion from 'prompt-autocompletion'

/**
 * Provides user input prompts via enquirer.js.
 *
 * @param context The running context.
 */
export default function attach(context: RunContext): void {
  const enquirer = new Enquirer()
  enquirer.register('list', promptList)
  enquirer.register('rawlist', promptRawlist)
  enquirer.register('confirm', promptConfirm)
  enquirer.register('expand', promptExpand)
  enquirer.register('checkbox', promptCheckbox)
  enquirer.register('radio', promptRadio)
  enquirer.register('password', promptPassword)
  enquirer.register('question', promptQuestion)
  enquirer.register('autocomplete', promptAutocompletion)

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
