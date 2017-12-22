/**
 * A script that helps generate some content for the strings documentation.
 */

const strings = require('../packages/gluegun/src/toolbox/string-tools')

const functions = [
  'camelCase',
  'kebabCase',
  'snakeCase',
  'upperCase',
  'lowerCase',
  'startCase',
  'upperFirst',
  'lowerFirst',
  'pascalCase',
]

const testCases = [
  'hello there',
  'Hello there',
  'abc123',
  'Y M C A',
  'Welcome to ZOMBO.com',
  'XMLHttpRequest is strange.',
  'OSnap',
  'this.is.sparta!',
]

functions.forEach(fn => {
  console.log('```js')
  testCases.forEach(testCase => {
    const result = strings[fn](testCase)
    console.log(`${fn}('${testCase}') // '${result}'`)
  })
  console.log('```')
  console.log('\n\n')
})

console.log('```js')
console.log(`repeat('x', 3) // '${strings.repeat('x', 3)}'`)
console.log(`repeat('xo', 3) // '${strings.repeat('xo', 3)}'`)
console.log('```')
console.log('\n\n')

console.log('```js')
console.log(`pad('hola', 20) // '${strings.pad('hola', 20)}'`)
console.log('```')
console.log('\n\n')
