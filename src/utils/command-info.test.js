const test = require('ava')
const { commandInfo } = require('./command-info')

test('commandInfo', t => {
  const fakeContext = {
    runtime: {
      plugins: [
        {
          commands: [
            {
              name: 'foo',
              description: 'foo is a command',
              commandPath: ['foo'],
              aliases: ['f'],
              hasAlias: () => true
            }
          ]
        }
      ]
    }
  }

  const info = commandInfo(fakeContext)
  t.deepEqual(info, [['foo (f)', 'foo is a command']])
})
