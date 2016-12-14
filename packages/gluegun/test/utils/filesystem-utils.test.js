const test = require('ava')
const {
  isFile,
  isNotFile,
  isDirectory,
  isNotDirectory
} = require('../../src/utils/filesystem-utils')

test('isFile', t => {
  t.true(isFile(__filename))
  t.false(isFile(__dirname))
})

test('isNotFile', t => {
  t.false(isNotFile(__filename))
  t.true(isNotFile(__dirname))
})

test('isDirectory', t => {
  t.true(isDirectory(__dirname))
  t.false(isDirectory(__filename))
})

test('isNotDirectory', t => {
  t.false(isNotDirectory(__dirname))
  t.true(isNotDirectory(__filename))
})

