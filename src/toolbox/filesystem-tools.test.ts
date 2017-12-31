import test from 'ava'
import { contains } from 'ramda'
import { isDirectory, isFile, isNotDirectory, isNotFile, subdirectories } from './filesystem-tools'

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
  t.is(dirs.length, 8)
  t.true(contains(`${__dirname}/../toolbox`, dirs))
})

test('blank subdirectories', t => {
  t.deepEqual(subdirectories(''), [])
  t.deepEqual(subdirectories(__filename), [])
})

test('relative subdirectories', t => {
  const dirs = subdirectories(`${__dirname}/..`, true)
  t.is(dirs.length, 8)
  t.true(contains(`toolbox`, dirs))
})

test('filtered subdirectories', t => {
  const dirs = subdirectories(`${__dirname}/..`, true, 'to*')
  t.is(1, dirs.length)
  t.true(contains(`toolbox`, dirs))
})
