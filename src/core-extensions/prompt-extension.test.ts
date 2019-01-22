import * as expect from 'expect'
import { Toolbox } from '../domain/toolbox'
import createExtension from './prompt-extension'
import { stdin } from 'mock-stdin'

// Key codes
const keys = { up: '\x1B\x5B\x41', down: '\x1B\x5B\x42', enter: '\x0D', space: '\x20' }

// Mock stdin so we can send messages to the CLI
let io = null
beforeAll(() => (io = stdin()))
afterAll(() => io.restore())

// helper function for timing
const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

test('has the proper interface', () => {
  const toolbox = new Toolbox()
  createExtension(toolbox)
  const { prompt } = toolbox
  expect(prompt).toBeTruthy()
  expect(typeof prompt.ask).toBe('function')
  expect(typeof prompt.confirm).toBe('function')
  expect(typeof prompt.separator).toBe('function')
})

test('works as expected', async done => {
  const toolbox = new Toolbox()
  createExtension(toolbox)
  const { prompt } = toolbox

  const sendKeystrokes = async () => {
    // list
    io.send(keys.down)
    io.send(keys.enter)
    await timeout(10)

    // rawlist
    io.send(keys.down)
    io.send(keys.down)
    io.send(keys.enter)
    await timeout(10)

    // confirm
    io.send('Y')
    io.send(keys.enter)
    await timeout(10)

    // expand
    io.send('a')
    io.send(keys.enter)
    await timeout(10)

    // checkbox
    io.send(keys.space)
    io.send(keys.down)
    io.send(keys.down)
    io.send(keys.space)
    io.send(keys.enter)
    await timeout(10)

    // radio
    io.send(keys.down)
    io.send(keys.space)
    io.send(keys.enter)
    await timeout(10)

    // password
    io.send('hunter2')
    io.send(keys.enter)
    await timeout(10)

    // input
    io.send('Alexander')
    io.send(keys.enter)
    await timeout(10)

    // autocomplete
    io.send('Wash')
    io.send(keys.enter)
    await timeout(10)
  }
  setTimeout(() => sendKeystrokes().then(), 5)

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

  expect(result).toEqual({
    exlist: 'Other',
    exrawlist: 'Mexico',
    exconfirm: true,
    exexpand: 'overwrite_all',
    excheckbox: ['red', 'yellow'],
    exradio: 'Trail Blazers',
    expassword: 'hunter2',
    exinput: 'Alexander',
    exautocomplete: 'Washington',
  })

  await timeout(2)
  done()
})
