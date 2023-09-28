import { parseParams } from './parameter-tools'

describe('parameter-tools', () => {
  describe('parseParams', () => {
    const cases = [
      {
        name: 'should coalesce --key=false boolean arguments',
        input: 'node ignite/bin/ignite new PizzaApp --overwrite=false',
        output: { array: ['node', 'ignite/bin/ignite', 'new', 'PizzaApp'], options: { overwrite: false } },
      },
      {
        name: 'should coalesce --key=true boolean arguments',
        input: 'node ignite/bin/ignite new PizzaApp --overwrite=true',
        output: { array: ['node', 'ignite/bin/ignite', 'new', 'PizzaApp'], options: { overwrite: true } },
      },
      {
        name: 'should coalesce --key true boolean arguments',
        input: 'node ignite/bin/ignite new PizzaApp --overwrite true',
        output: { array: ['node', 'ignite/bin/ignite', 'new', 'PizzaApp'], options: { overwrite: true } },
      },
      {
        name: 'should coalesce --key false boolean arguments',
        input: 'node ignite/bin/ignite new PizzaApp --overwrite false',
        output: { array: ['node', 'ignite/bin/ignite', 'new', 'PizzaApp'], options: { overwrite: false } },
      },
      {
        name: 'should coalesce --key flag with no value to true',
        input: 'node ignite/bin/ignite new PizzaApp --overwrite',
        output: { array: ['node', 'ignite/bin/ignite', 'new', 'PizzaApp'], options: { overwrite: true } },
      },
      {
        name: 'should coalesce --key=0 number arguments to number type',
        input: 'node ignite/bin/ignite new PizzaApp --port=8080',
        output: { array: ['node', 'ignite/bin/ignite', 'new', 'PizzaApp'], options: { port: 8080 } },
      },
    ]

    cases.forEach(({ name, input, output }) => {
      it(name, () => {
        expect(parseParams(input)).toEqual(output)
      })
    })
  })
})
