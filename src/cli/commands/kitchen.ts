import { prompt } from '../../toolbox/prompt-tools'
import { GluegunToolbox } from '../../domain/toolbox'

module.exports = {
  name: 'kitchen',
  description: 'Runs through a kitchen sink of Gluegun tools',
  run: async (toolbox: GluegunToolbox) => {
    const { print } = toolbox

    const result = await prompt.ask([
      {
        type: 'list',
        name: 'exlist',
        message: 'What shoes are you wearing?',
        choices: ['Clown', 'Other'],
      },
      {
        type: 'rawlist',
        name: 'exrawlist',
        message: 'What nation?',
        choices: ['Canada', 'United States', 'Mexico'],
      },
      {
        type: 'confirm',
        name: 'exconfirm',
        message: 'Are you sure?',
      },
      {
        type: 'expand',
        name: 'exexpand',
        message: 'What action?',
        choices: [
          {
            key: 'y',
            name: 'Overwrite',
            value: 'overwrite',
          },
          {
            key: 'a',
            name: 'Overwrite this one and all next',
            value: 'overwrite_all',
          },
        ],
      },
      {
        type: 'checkbox',
        name: 'excheckbox',
        message: 'What are your favorite colors?',
        choices: ['red', 'blue', 'yellow'],
      },
      {
        type: 'radio',
        name: 'exradio',
        message: 'What is your favorite team?',
        choices: ['Jazz', 'Trail Blazers', 'Lakers', 'Warriors'],
      },
      {
        type: 'password',
        name: 'expassword',
        message: 'Enter a fake password',
      },
      {
        type: 'input',
        name: 'exinput',
        message: 'What is your middle name?',
      },
      {
        type: 'autocomplete',
        name: 'exautocomplete',
        message: 'State?',
        choices: ['Oregon', 'Washington', 'California'],
        // You can leave this off unless you want to customize behavior
        suggest: (s: string, choices: any[]) => {
          return choices.filter(choice => {
            return choice.message.toLowerCase().startsWith(s.toLowerCase())
          })
        },
      },
    ])

    print.debug(result)
  },
}
