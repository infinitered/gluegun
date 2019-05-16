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
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

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
    await delay(10)

    // confirm
    io.send('Y')
    // io.send(keys.enter)
    await delay(10)

    // multiselect
    io.send(keys.space)
    io.send(keys.down)
    io.send(keys.down)
    io.send(keys.space)
    io.send(keys.enter)
    await delay(10)

    // select
    io.send(keys.down)
    io.send(keys.enter)
    await delay(10)

    // password
    io.send('hunter2')
    io.send(keys.enter)
    await delay(10)

    // input
    io.send('Alexander')
    io.send(keys.enter)
    await delay(10)

    // autocomplete
    io.send('Wash')
    io.send(keys.enter)
    await delay(10)
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
      suggest(input, choices) {
        return choices.filter(choice => choice.message.startsWith(input))
      },
    },
  ])

  expect(result).toEqual({
    exlist: 'Other',
    exconfirm: true,
    exmultiselect: ['red', 'yellow'],
    exselect: 'Trail Blazers',
    expassword: 'hunter2',
    exinput: 'Alexander',
    exautocomplete: 'Washington',
  })

  await delay(2)
  done()
})

test('Confirm can accept default value', async () => {
  const toolbox = new Toolbox()
  createExtension(toolbox)
  const { prompt } = toolbox

  const sendKeystrokes = async () => {
    io.send(keys.enter)
    await delay(10)
  }
  setTimeout(() => sendKeystrokes().then(), 5)

  const result = await prompt.confirm('Is default Yes?', true)
  expect(result).toBeTruthy()
})
