import { GluegunPrompt, GluegunQuestionType, GluegunAskResponse } from './prompt-types'

let enquirer = null
function getEnquirer() {
  if (enquirer) return enquirer

  const Enquirer = require('enquirer')
  enquirer = new Enquirer()

  return enquirer
}

/**
 * A yes/no question.
 *
 * @param message The message to display to the user.
 * @returns The true/false answer.
 */
const confirm = async (message: string): Promise<boolean> => {
  const { yesno } = await getEnquirer().prompt({
    name: 'yesno',
    type: 'confirm',
    message,
  })
  return yesno
}

/**
 * We're replicating the interface of Enquirer in order to
 * "lazy load" the package only if and when we actually are asked for it.
 * This results in a significant speed increase.
 */
const prompt: GluegunPrompt = {
  confirm,
  ask: async (questions: GluegunQuestionType | GluegunQuestionType[]): Promise<GluegunAskResponse> => {
    if (Array.isArray(questions)) {
      questions = questions.map(q => {
        if (q.type === 'rawlist' || q.type === 'list') q.type = 'select'
        if (q.type === 'expand') q.type = 'autocomplete'
        if (q.type === 'checkbox') q.type = 'multiselect'
        if (q.type === 'radio') q.type = 'select'
        if (q.type === 'question') q.type = 'input'
        return q
      })
    }
    return getEnquirer().prompt(questions)
  },
  separator: () => getEnquirer().separator(),
}

export { prompt, GluegunPrompt }
