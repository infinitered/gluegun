import test from 'ava'
import { contains } from 'ramda'
import { filesystem } from './filesystem-tools'

test('isFile', t => {
  t.true(filesystem.isFile(__filename))
  t.false(filesystem.isFile(__dirname))
})

test('isNotFile', t => {
  t.false(filesystem.isNotFile(__filename))
  t.true(filesystem.isNotFile(__dirname))
})

test('isDirectory', t => {
  t.true(filesystem.isDirectory(__dirname))
  t.false(filesystem.isDirectory(__filename))
})

test('isNotDirectory', t => {
  t.false(filesystem.isNotDirectory(__dirname))
  t.true(filesystem.isNotDirectory(__filename))
})

test('subdirectories', t => {
  const dirs = filesystem.subdirectories(`${__dirname}/..`)
  t.is(dirs.length, 8)
  t.true(contains(`${__dirname}/../toolbox`, dirs))
})

test('blank subdirectories', t => {
  t.deepEqual(filesystem.subdirectories(''), [])
  t.deepEqual(filesystem.subdirectories(__filename), [])
})

test('relative subdirectories', t => {
  const dirs = filesystem.subdirectories(`${__dirname}/..`, true)
  t.is(dirs.length, 8)
  t.true(contains(`toolbox`, dirs))
})

test('filtered subdirectories', t => {
  const dirs = filesystem.subdirectories(`${__dirname}/..`, true, 'to*')
  t.is(1, dirs.length)
  t.true(contains(`toolbox`, dirs))
})
