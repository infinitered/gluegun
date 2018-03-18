import * as expect from 'expect'
import { strings } from './string-tools'

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
  repeat,
  pluralize,
  plural,
  singular,
  addPluralRule,
  addSingularRule,
  addIrregularRule,
  addUncountableRule,
  isPlural,
  isSingular,
} = strings

test('isBlank', () => {
  expect(isBlank(null)).toBe(true)
  expect(isBlank('')).toBe(true)
  expect(isBlank(' ')).toBe(true)
  expect(isBlank('s')).toBe(false)
})

test('isNotString', () => {
  expect(isNotString('')).toBe(false)
  expect(isNotString(2)).toBe(true)
  expect(isNotString(null)).toBe(true)
  expect(isNotString(undefined)).toBe(true)
  expect(isNotString([])).toBe(true)
  expect(isNotString({})).toBe(true)
})

test('camelCase', () => {
  expect(camelCase('this here')).toBe('thisHere')
})

test('kebabCase', () => {
  expect(kebabCase('fun times')).toBe('fun-times')
  expect(kebabCase('FunTimes')).toBe('fun-times')
})

test('snakeCase', () => {
  expect(snakeCase('a b c')).toBe('a_b_c')
  expect(snakeCase('AlwaysBeClosing')).toBe('always_be_closing')
})

test('upperCase', () => {
  expect(upperCase('lol')).toBe('LOL')
})

test('lowerCase', () => {
  expect(lowerCase('ROFL')).toBe('rofl')
})

test('startCase', () => {
  expect(startCase('hello there')).toBe('Hello There')
})

test('upperFirst', () => {
  expect(upperFirst('hello world')).toBe('Hello world')
})

test('lowerFirst', () => {
  expect(lowerFirst('BOOM')).toBe('bOOM')
})

test('pascalCase', () => {
  expect(pascalCase('check it out')).toBe('CheckItOut')
  expect(pascalCase('checkIt-out')).toBe('CheckItOut')
})

test('pad', () => {
  expect(pad('a', 3)).toBe(' a ')
})

test('padStart', () => {
  expect(padStart('a', 3)).toBe('  a')
})

test('padEnd', () => {
  expect(padEnd('a', 3)).toBe('a  ')
})

test('trim', () => {
  expect(trim('   sloppy   ')).toBe('sloppy')
})

test('trimStart', () => {
  expect(trimStart('   ! ')).toBe('! ')
})

test('trimEnd', () => {
  expect(trimEnd('  !  ')).toBe('  !')
})

test('repeat', () => {
  expect(repeat('a', 4)).toBe('aaaa')
})

test('identity', () => {
  expect(identity('x')).toBe('x')
})

test('pluralize', () => {
  expect(pluralize('test', 1, true)).toBe('1 test')
  expect(pluralize('test', 5, true)).toBe('5 tests')
})

test('plural', () => {
  expect(plural('bug')).toBe('bugs')
})

test('singular', () => {
  expect(singular('bugs')).toBe('bug')
})

test('addPluralRule', () => {
  addPluralRule(/gex$/i, 'gexii')
  expect(plural('regex')).toBe('regexii')
})

test('addSingularRule', () => {
  addSingularRule(/bugs$/i, 'bugger')
  expect(singular('bugs')).toBe('bugger')
})

test('addIrregularRule', () => {
  addIrregularRule('octopus', 'octopodes')
  expect(plural('octopus')).toBe('octopodes')
})

test('addUncountableRule', () => {
  addUncountableRule('paper')
  expect(plural('paper')).toBe('paper')
})

test('isPlural', () => {
  expect(isPlural('bug')).toBe(false)
  expect(isPlural('bugs')).toBe(true)
})

test('isSingular', () => {
  expect(isSingular('bug')).toBe(true)
  expect(isSingular('bugs')).toBe(false)
})
