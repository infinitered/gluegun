const test = require('ava')
const {
  identity,
  isBlank,
  isNotString,
  camelCase,
  kebabCase,
  snakeCase,
  upperCase,
  lowerCase,
  startCase,
  upperFirst,
  lowerFirst,
  pascalCase,
  pad,
  padStart,
  padEnd,
  trim,
  trimStart,
  trimEnd,
  repeat
} = require('../../src/utils/string-utils')

test('isBlank', t => {
  t.true(isBlank())
  t.true(isBlank(1))
  t.true(isBlank(true))
  t.true(isBlank(false))
  t.true(isBlank(null))
  t.true(isBlank(''))
  t.true(isBlank(' '))
  t.true(isBlank({}))
  t.true(isBlank([]))
  t.false(isBlank('s'))
})

test('isNotString', t => {
  t.true(isNotString())
  t.true(isNotString(1))
  t.true(isNotString(true))
  t.true(isNotString(false))
  t.true(isNotString(null))
  t.true(isNotString({}))
  t.true(isNotString([]))
  t.false(isNotString(''))
  t.false(isNotString('s'))
})

test('isNotString', t => {
  t.false(isNotString(''))
  t.true(isNotString(2))
  t.true(isNotString(null))
  t.true(isNotString(undefined))
  t.true(isNotString([]))
  t.true(isNotString({}))
})

test('camelCase', t => {
  t.is(camelCase('this here'), 'thisHere')
})

test('kebabCase', t => {
  t.is(kebabCase('fun times'), 'fun-times')
  t.is(kebabCase('FunTimes'), 'fun-times')
})

test('snakeCase', t => {
  t.is(snakeCase('a b c'), 'a_b_c')
  t.is(snakeCase('AlwaysBeClosing'), 'always_be_closing')
})

test('upperCase', t => {
  t.is(upperCase('lol'), 'LOL')
})

test('lowerCase', t => {
  t.is(lowerCase('ROFL'), 'rofl')
})

test('startCase', t => {
  t.is(startCase('hello there'), 'Hello There')
})

test('upperFirst', t => {
  t.is(upperFirst('hello world'), 'Hello world')
})

test('lowerFirst', t => {
  t.is(lowerFirst('BOOM'), 'bOOM')
})

test('pascalCase', t => {
  t.is(pascalCase('check it out'), 'CheckItOut')
  t.is(pascalCase('checkIt-out'), 'CheckItOut')
})

test('pad', t => {
  t.is(pad('a', 3), ' a ')
})

test('padStart', t => {
  t.is(padStart('a', 3), '  a')
})

test('padEnd', t => {
  t.is(padEnd('a', 3), 'a  ')
})

test('trim', t => {
  t.is(trim('   sloppy   '), 'sloppy')
})

test('trimStart', t => {
  t.is(trimStart('   ! '), '! ')
})

test('trimEnd', t => {
  t.is(trimEnd('  !  '), '  !')
})

test('repeat', t => {
  t.is(repeat('a', 4), 'aaaa')
})

test('identity', t => {
  t.is(identity('x'), 'x')
})
