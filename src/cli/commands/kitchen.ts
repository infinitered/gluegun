import { prompt } from '../../toolbox/prompt-tools'
import { GluegunToolbox } from '../../domain/toolbox'

module.exports = {
  name: 'kitchen',
  description: 'Runs through a kitchen sink of Gluegun tools',
  run: async (toolbox: GluegunToolbox) => {
    const { print } = toolbox

    const update = await toolbox.meta.checkForUpdate()
    print.info(`Checking for update: ${update}`)

    const result = await prompt.ask([
      {
        type: 'list',
        name: 'exlist',
        message: 'What shoes are you wearing?',
        choices: ['Clown', 'Other'],
      },
      {
        type: 'confirm',
        name: 'exconfirm',
        message: 'Are you sure?',
      },
      {
        type: 'select',
        name: 'exselect',
        message: 'What is your favorite team?',
        choices: ['Jazz', 'Trail Blazers', 'Lakers', 'Warriors'],
      },
      {
        type: 'multiselect',
        name: 'exmultiselect',
        message: 'What are your favorite months?',
        choices: ['January', 'July', 'September', 'November'],
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
        suggest(s, choices) {
          return choices.filter((choice) => {
            return choice.message.toLowerCase().startsWith(s.toLowerCase())
          })
        },
      },
    ])

    print.debug(result)
  },
}
