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
   * Appends given data to the end of file. If file or any parent directory doesn't exist it will be created.
   *
   * @param path The path to the file.
   * @param data The data to append.
   * @param options Additional options.
   */
  append: (path: string, data: string | Buffer, options?: GluegunFilesystemAppendOptions) => void

  /**
   * Appends given data to the end of file. If file or any parent directory doesn't exist it will be created.
   *
   * @param path The path to the file.
   * @param data The data to append.
   * @param options Additional options.
   */
  appendAsync: (path: string, data: string | Buffer, options?: GluegunFilesystemAppendOptions) => Promise<void>

  /** Copies given file or directory (with everything inside). */
  copy: (from: string, to: string, options?: GluegunFilesystemCopyOptions) => void

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

  /** Copies given file or directory (with everything inside). */
  copyAsync: (from: string, to: string, options?: GluegunFilesystemCopyOptions) => Promise<void>

  /** See Node's fs.createReadStream. */
  createReadStream: (path: string | Buffer | URL, options: any) => any

  /** See Node's fs.createWriteStream. */
  createWriteStream: (path: string | Buffer | URL, options: any) => any

  /** Returns Current Working Directory (CWD) for this instance of jetpack, or creates new jetpack object with given path as its internal CWD. */
  cwd: (...strings) => any

  /**
   * Ensures that directory on given path exists and meets given criteria.
   *
   * If any criterium is not met it will be after this call. If any parent directory in path doesn't exist it will be created (like mkdir -p).
   */
  dir: (path: string, options?: GluegunFilesystemDirOptions) => any

  /**
   * Ensures that directory on given path exists and meets given criteria.
   *
   * If any criterium is not met it will be after this call. If any parent directory in path doesn't exist it will be created (like mkdir -p).
   */
  dirAsync: (path: string, options?: GluegunFilesystemDirOptions) => Promise<any>

  /**
   * Checks whether something exists on given path.
   */
  exists: (path: string) => false | 'dir' | 'file' | 'other'

  /**
   * Checks whether something exists on given path.
   */
  existsAsync: (path: string) => Promise<false | 'dir' | 'file' | 'other'>

  /**
   * Ensures that file exists and meets given criteria.
   *
   * If any criterium is not met it will be after this call. If any parent directory in path doesn't exist it will be created (like mkdir -p).
   */
  file: (path: string, options: GluegunFilesystemFileOptions) => any

  /**
   * Ensures that file exists and meets given criteria.
   *
   * If any criterium is not met it will be after this call. If any parent directory in path doesn't exist it will be created (like mkdir -p).
   */
  fileAsync: (path: string, options: GluegunFilesystemFileOptions) => any

  /**
   * Finds in directory specified by path all files fulfilling searchOptions.
   */
  find(path: string, options?: GluegunFilesystemFindOptions): string[]
  find(options: GluegunFilesystemFindOptions): string[]

  /**
   * Finds in directory specified by path all files fulfilling searchOptions.
   */
  findAsync(path: string, options?: GluegunFilesystemFindOptions): Promise<string[]>
  findAsync(options: GluegunFilesystemFindOptions): Promise<string[]>

  /**
   * Returns details about a filesystem object found at a path.
   */
  inspect(path: string, options?: GluegunFileSystemInspectOptions): GluegunFileSystemInspectResult[] | void

  /**
   * Returns details about a filesystem object found at a path.
   */
  inspectAsync(
    path: string,
    options?: GluegunFileSystemInspectOptions,
  ): Promise<GluegunFileSystemInspectResult[] | void>

  /**
   * Returns details about a filesystem tree found at the path.
   */
  inspectTree(path: string, options?: GluegunFileSystemInspectTreeOptions): GluegunFileSystemInspectTreeResult | void

  /**
   * Returns details about a filesystem tree found at the path.
   */
  inspectTreeAsync(
    path: string,
    options?: GluegunFileSystemInspectTreeOptions,
  ): Promise<GluegunFileSystemInspectTreeResult | void>

  /**
   * Lists the contents of directory.
   */
  list(path?: string): string[] | void

  /**
   * Lists the contents of directory.
   */
  listAsync(path?: string): Promise<string[] | void>

  /**
   * Moves given path to a new location.
   */
  move(from: string, to: string): void

  /**
   * Moves given path to a new location.
   */
  moveAsync(from: string, to: string): void

  /**
   * Resolves an absolute path.
   */
  path(...strings): any

  /**
   * Reads the contents of a file.
   *
   * @param path The path to read from.
   * @param options Additional options.
   */
  read(path: string, options?: GluegunFilesystemReadType): string | Buffer | any

  /**
   * Reads the contents of a file.
   *
   * @param path The path to read from.
   * @param options Additional options.
   */
  readAsync(path: string, options?: GluegunFilesystemReadType): Promise<string | Buffer | any>

  /**
   * Deletes the path or file. It may or may not exist.
   */
  remove(path?: string): void

  /**
   * Deletes the path or file. It may or may not exist.
   */
  removeAsync(path?: string): Promise<void>

  /**
   * Renames a file or directory. The `to` is just the file name as this only renames in the same directory.
   */
  rename(from: string, to: string): void

  /**
   * Renames a file or directory. The `to` is just the file name as this only renames in the same directory.
   */
  renameAsync(from: string, to: string): Promise<void>

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
   * Creates a symlink.
   */
  symlink(from: string, to: string): void

  /**
   * Creates a symlink.
   */
  symlinkAsync(from: string, to: string): Promise<void>

  /**
   * Writes the contents of a file.
   */
  write(path: string, data: any, options?: GluegunFilesystemWriteOptions): void

  /**
   * Writes the contents of a file.
   */
  writeAsync(path: string, data: any, options?: GluegunFilesystemWriteOptions): Promise<void>

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
