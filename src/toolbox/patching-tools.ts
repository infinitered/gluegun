import { is } from './utils'
import { filesystem } from './filesystem-tools'
import { GluegunPatchingPatchOptions, GluegunPatching } from './patching-types'

/**
 * Identifies if something exists in a file. Async.
 *
 * @param filename The path to the file we'll be scanning.
 * @param findPattern The case sensitive string or RegExp that identifies existence.
 * @return Boolean of success that findPattern was in file.
 */
export async function exists(filename: string, findPattern: string | RegExp): Promise<boolean> {
  // sanity check the filename
  if (!is(String, filename) || filesystem.isNotFile(filename)) return false

  // sanity check the findPattern
  const patternIsString = typeof findPattern === 'string'
  if (!(findPattern instanceof RegExp) && !patternIsString) return false

  // read from jetpack -- they guard against a lot of the edge
  // cases and return nil if problematic
  const contents = filesystem.read(filename)

  // only let the strings pass
  if (!is(String, contents)) return false

  // do the appropriate check
  return isPatternIncluded(contents, findPattern)
}

/**
 * Updates a text file or json config file. Async.
 *
 * @param filename File to be modified.
 * @param callback Callback function for modifying the contents of the file.
 */
export async function update(
  filename: string,
  callback: (contents: string | object) => string | object | false,
): Promise<string | object | false> {
  const contents = await readFile(filename)

  // let the caller mutate the contents in memory
  const mutatedContents = callback(contents)

  // only write if they actually sent back something to write
  if (mutatedContents !== false) {
    await filesystem.writeAsync(filename, mutatedContents, { atomic: true })
  }

  return mutatedContents
}

/**
 * Convenience function for prepending a string to a given file. Async.
 *
 * @param filename       File to be prepended to
 * @param prependedData  String to prepend
 */
export async function prepend(filename: string, prependedData: string): Promise<string | false> {
  return update(filename, data => prependedData + data) as Promise<string | false>
}

/**
 * Convenience function for appending a string to a given file. Async.
 *
 * @param filename       File to be appended to
 * @param appendedData  String to append
 */
export async function append(filename: string, appendedData: string): Promise<string | false> {
  return update(filename, data => data + appendedData) as Promise<string | false>
}

/**
 * Convenience function for replacing a string in a given file. Async.
 *
 * @param filename       File to be prepended to
 * @param oldContent     String to replace
 * @param newContent     String to write
 */
export async function replace(filename: string, oldContent: string, newContent: string): Promise<string | false> {
  return update(filename, data => (data as string).replace(oldContent, newContent)) as Promise<string | false>
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
 *   await toolbox.patching.patch('thing.js', { before: 'bar', insert: 'foo' })
 *
 */
export async function patch(filename: string, ...opts: GluegunPatchingPatchOptions[]): Promise<string | false> {
  return update(filename, (data: string) => {
    const result = opts.reduce(
      (updatedData: string, opt: GluegunPatchingPatchOptions) => patchString(updatedData, opt) || updatedData,
      data,
    )

    return result !== data && result
  }) as Promise<string | false>
}

export async function readFile(filename: string): Promise<string> {
  // bomb if the file doesn't exist
  if (!filesystem.isFile(filename)) throw new Error(`file not found ${filename}`)

  // check type of file (JSON or not)
  if (filename.endsWith('.json')) {
    return filesystem.readAsync(filename, 'json')
  } else {
    return filesystem.readAsync(filename, 'utf8')
  }
}

export function patchString(data: string, opts: GluegunPatchingPatchOptions = {}): string | false {
  // Already includes string, and not forcing it
  if (isPatternIncluded(data, opts.insert) && !opts.force) return false

  // delete <string> is the same as replace <string> + insert ''
  const replaceString = opts.delete || opts.replace

  if (replaceString) {
    if (!isPatternIncluded(data, replaceString)) return false

    // Replace matching string with new string or nothing if nothing provided
    return data.replace(replaceString, `${opts.insert || ''}`)
  } else {
    return insertNextToPattern(data, opts)
  }
}

function insertNextToPattern(data: string, opts: GluegunPatchingPatchOptions) {
  // Insert before/after a particular string
  const findPattern: string | RegExp = opts.before || opts.after

  // sanity check the findPattern
  const patternIsString = typeof findPattern === 'string'
  if (!(findPattern instanceof RegExp) && !patternIsString) return false

  const isPatternFound = isPatternIncluded(data, findPattern)
  if (!isPatternFound) return false

  const originalString = patternIsString ? findPattern : data.match(findPattern)[0]
  const newContents = opts.after ? `${originalString}${opts.insert || ''}` : `${opts.insert || ''}${originalString}`
  return data.replace(findPattern, newContents)
}

function isPatternIncluded(data: string, findPattern: string | RegExp): boolean {
  if (!findPattern) return false
  return typeof findPattern === 'string' ? data.includes(findPattern) : findPattern.test(data)
}

const patching: GluegunPatching = { update, append, prepend, replace, patch, exists }

export { patching, GluegunPatching, GluegunPatchingPatchOptions }
