import * as jetpack from 'fs-jetpack'
import { test, is } from 'ramda'
import { isFile, isNotFile } from './filesystem-tools'
import { GluegunPatchingPatchOptions } from '..'

/**
 * Identifies if something exists in a file. Async.
 *
 * @param filename The path to the file we'll be scanning.
 * @param findPattern The case sensitive string or RegExp that identifies existence.
 * @return Boolean of success that findPattern was in file.
 */
export async function exists(filename: string, findPattern: string | RegExp): Promise<boolean> {
  // sanity check the filename
  if (!is(String, filename) || isNotFile(filename)) {
    return false
  }

  // sanity check the findPattern
  const patternIsString = typeof findPattern === 'string'
  if (!(findPattern instanceof RegExp) && !patternIsString) {
    return false
  }

  // read from jetpack -- they guard against a lot of the edge
  // cases and return nil if problematic
  const contents = jetpack.read(filename)

  // only let the strings pass
  if (!is(String, contents)) {
    return false
  }

  // do the appropriate check
  return patternIsString ? contents.includes(findPattern) : test(findPattern as RegExp, contents)
}

/**
 * Updates a text file or json config file. Async.
 *
 * @param filename File to be modified.
 * @param callback Callback function for modifying the contents of the file.
 * @return The new contents of the file.
 */
export async function update(filename: string, callback: (contents: string) => string | boolean): Promise<boolean> {
  const contents = await readFile(filename)

  // let the caller mutate the contents in memory
  const mutatedContents = callback(contents)

  // only write if they actually sent back something to write
  if (is(String, mutatedContents)) {
    await jetpack.writeAsync(filename, mutatedContents, { atomic: true })
    return true
  } else {
    return false
  }
}

/**
 * Convenience function for prepending a string to a given file. Async.
 *
 * @param filename       File to be prepended to
 * @param prependedData  String to prepend
 */
export async function prepend(filename: string, prependedData: string): Promise<boolean> {
  return update(filename, data => prependedData + data)
}

/**
 * Convenience function for appending a string to a given file. Async.
 *
 * @param filename       File to be appended to
 * @param appendedData  String to append
 */
export async function append(filename: string, appendedData: string): Promise<boolean> {
  return update(filename, data => data + appendedData)
}

/**
 * Convenience function for replacing a string in a given file. Async.
 *
 * @param filename       File to be prepended to
 * @param oldContent     String to replace
 * @param newContent     String to write
 */
export async function replace(filename: string, oldContent: string, newContent: string): Promise<boolean> {
  return update(filename, data => data.replace(oldContent, newContent))
}

/**
 * Conditionally places a string into a file before or after another string,
 * or replacing another string, or deletes a string. Async.
 *
 * @param filename        File to be patched
 * @param opts            Options
 * @param opts.insert     String to be inserted
 * @param opts.before     Insert before this string
 * @param opts.after      Insert after this string
 * @param opts.replace    Replace this string
 * @param opts.delete     Delete this string
 * @param opts.force      Write even if it already exists
 *
 * @example
 *   await context.patching.patch('thing.js', { before: 'bar', insert: 'foo' })
 *
 */
export async function patch(filename: string, opts: GluegunPatchingPatchOptions = {}): Promise<boolean> {
  return update(filename, data => patchString(data, opts))
}

export async function readFile(filename: string): Promise<string> {
  // bomb if the file doesn't exist
  if (!isFile(filename)) {
    throw new Error(`file not found ${filename}`)
  }

  // check type of file (JSON or not)
  const fileType = filename.endsWith('.json') ? 'json' : 'utf8'

  // read the file
  const contents = await jetpack.readAsync(filename, fileType)

  return contents
}

export function patchString(data: string, opts: GluegunPatchingPatchOptions = {}): string | false {
  // Already includes string, and not forcing it
  if (data.includes(opts.insert) && !opts.force) {
    return false
  }

  // delete <string> is the same as replace <string> + insert ''
  const replaceString = opts.delete || opts.replace

  if (replaceString) {
    if (!data.includes(replaceString)) {
      return false
    }
    // Replace matching string with new string or nothing if nothing provided
    return data.replace(replaceString, `${opts.insert || ''}`)
  } else {
    return insertNextToString(data, opts)
  }
}

function insertNextToString(data, opts) {
  // Insert before/after a particular string
  const findString = opts.before || opts.after
  if (!data.includes(findString)) {
    return false
  }

  const newContents = opts.after ? `${findString}${opts.insert || ''}` : `${opts.insert || ''}${findString}`
  return data.replace(findString, newContents)
}
