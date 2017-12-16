const test = require('ava')
const {
  isFile,
  isNotFile,
  isDirectory,
  isNotDirectory,
  subdirectories
} = require('./filesystem-utils')
const { contains } = require('ramda')

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

test('subdirectories', t => {
  const dirs = subdirectories(`${__dirname}/..`)
  t.is(dirs.length, 7)
  t.true(contains(`${__dirname}/../utils`, dirs))
})

test('blank subdirectories', t => {
  t.deepEqual(subdirectories(), [])
  t.deepEqual(subdirectories(''), [])
  t.deepEqual(subdirectories(__filename), [])
})

test('relative subdirectories', t => {
  const dirs = subdirectories(`${__dirname}/..`, true)
  t.is(dirs.length, 7)
  t.true(contains(`utils`, dirs))
})

test('filtered subdirectories', t => {
  const dirs = subdirectories(`${__dirname}/..`, true, 'ut*')
  t.is(1, dirs.length)
  t.true(contains(`utils`, dirs))
})
