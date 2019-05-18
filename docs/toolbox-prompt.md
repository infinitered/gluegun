Prompt allows you to ask the user for input.

You can access these tools on the Gluegun toolbox, via `const { prompt } = require('gluegun')`, or directly via `const { prompt } = require('gluegun/prompt')`.

## ask

This is powered by [enquirer](https://github.com/enquirer/enquirer) (2.x).

> This is an **async** function.

#### example

```js
// text input
const askAge = { type: 'input', name: 'age', message: 'How old are you?' }

// multiple choice
const askShoe = {
  type: 'select',
  name: 'shoe',
  message: 'What shoes are you wearing?',
  choices: ['Clown', 'Other'],
}

// ask a series of questions
const questions = [askAge, askShoe]
const { age, shoe } = await toolbox.prompt.ask(questions)
```

_Note: to see a full list of examples, scroll to the bottom._

**Important: in order to preserve backwards compatibility with Enquirer 1.x, we
translate `type: 'list'` to `type: 'select'`. If you want to use the new `list`
behavior, please use `enquirer` directly and not through Gluegun.**

## confirm

> This is an **async** function.

A pre-built prompt which asks a yes or no question.

#### parameters

- **message** is a `string` required for displaying a message to user. It's the question you're asking.
- (optional) **initial** is a `boolean` for setting which answer is the default. `true` for Yes, `false` for No. Defaults to false.

#### returns

`true` or `false`

#### example

```js
const isThe90s = await toolbox.prompt.confirm('Ya`ll ready for this?')
```

## separator

Returns a separator you can use in your multiple choice prompts. It will draw a nice `--------` line and will not be able to be selected by the user.

#### parameters

- none

#### returns

A value only relevant for use in a multiple choice prompt.

#### example

```js
const choices = ['red', 'green', toolbox.prompt.separator(), 'cheese', 'bread']
```

## Kitchen Sink Example

Try running `gluegun kitchen` to see what these look like.

```typescript
import { prompt, GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'kitchen',
  description: 'Runs through a kitchen sink of Gluegun tools',
  run: async (toolbox: GluegunToolbox) => {
    const { print } = toolbox

    const result = await prompt.ask([
      {
        type: 'select',
        name: 'exselect',
        message: 'What shoes are you wearing?',
        choices: ['Clown', 'Other'],
      },
      {
        type: 'confirm',
        name: 'exconfirm',
        message: 'Are you sure?',
      },
      {
        type: 'multiselect',
        name: 'exmultiselect',
        message: 'What are your favorite colors?',
        choices: ['red', 'blue', 'yellow'],
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
          return choices.filter(choice => {
            return choice.message.toLowerCase().startsWith(s.toLowerCase())
          })
        },
      },
    ])

    print.debug(result)
  },
}
```
