import { FSJetpack } from 'fs-jetpack/types'

export interface GluegunFilesystem extends FSJetpack {
  /**
   * Convenience property for `os.EOL`.
   */
  eol: string

  /**
   * Convenience property for `path.sep`.
   */
  separator: string

  /**
   * Convenience property for `os.homedir` function
   */
  homedir: () => string

  /**
   * The right-most parameter is considered {to}.  Other parameters are considered an array of {from}.
   *
   * Starting from leftmost {from} parameter, resolves {to} to an absolute path.
   *
   * If {to} isn't already absolute, {from} arguments are prepended in right to left order,
   * until an absolute path is found. If after using all {from} paths still no absolute path is found,
   * the current working directory is used as well. The resulting path is normalized,
   * and trailing slashes are removed unless the path gets resolved to the root directory.
   *
   * @param pathSegments string paths to join.  Non-string arguments are ignored.
   */
  chmodSync: typeof import('fs').chmodSync

  /**
   * The right-most parameter is considered {to}.  Other parameters are considered an array of {from}.
   *
   * Starting from leftmost {from} parameter, resolves {to} to an absolute path.
   *
   * If {to} isn't already absolute, {from} arguments are prepended in right to left order,
   * until an absolute path is found. If after using all {from} paths still no absolute path is found,
   * the current working directory is used as well. The resulting path is normalized,
   * and trailing slashes are removed unless the path gets resolved to the root directory.
   *
   * @param pathSegments string paths to join.  Non-string arguments are ignored.
   */
  resolve: typeof import('path').resolve

  /**
   * Retrieves a list of subdirectories for a given path.
   */
  subdirectories(path: string, isRelative?: boolean, matching?: string): string[]

  /**
   * Is this a file?
   */
  isFile(path: string): boolean

  /**
   * Is this not a file?
   */
  isNotFile(path: string): boolean

  /**
   * Is this a directory?
   */
  isDirectory(path: string): boolean

  /**
   * Is this not a directory?
   */
  isNotDirectory(path: string): boolean
}

// from https://github.com/Microsoft/TypeScript/blob/master/src/lib/dom.generated.d.ts#L12209-L12223
// added manually so we don't have to import typescript's dom typings
export interface URL {
  hash: string
  host: string
  hostname: string
  href: string
  readonly origin: string
  password: string
  pathname: string
  port: string
  protocol: string
  search: string
  username: string
  readonly searchParams: any
  toString(): string
}
