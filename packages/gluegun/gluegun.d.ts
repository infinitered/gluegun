export interface GluegunCommand {
  /** The command's name. */
  name: string
  /** A friendly description. */
  description?: string
  /** An alias for the command. */
  alias?: string
  /** The path to the file name for this command. */
  file?: string
  /** The command path, an array that describes how to get to this command */
  commandPath?: string[]
  /**
   * Runs the command.
   *
   * @param context The run context.
   */
  run(context: GluegunRunContext): Promise<any | void>
  /** Is this command hidden from the command line? */
  hidden?: boolean
}

export interface GluegunPlugin {
  /** The name of the plugin. */
  name?: string
  /** A description used in the cli. */
  description?: string
  /** Default configuration values. */
  defaults?: any
  /** The directory this plugin lives in. */
  directory?: string
  /** Should we hide this command from the cli? */
  hidden?: boolean
  /** The commands in this plugin. */
  commands: GluegunCommand[]
  /** The extensions in this plugin. */
  extensions: GluegunExtension[]
}

export interface GluegunExtension {
  /** The name of the extension. */
  name: string
  /** The description. */
  description?: string
  /** The file this extension comes from. */
  file?: string
  /** The register function used when setting up. */
  setup?: GluegunExtensionAttacher
}

/**
 * Passed into the `run()` of the `GluegunRuntime`, this is a manual
 * way to run a command within the system.
 */
export interface GluegunRunOptions {
  /** The name of the plugin to run. */
  pluginName?: string

  /**
   * The raw command contains the name of the command plus
   * any named parameters.
   */
  rawCommand?: string

  /** The options to pass into the  */
  options?: any
}

/**
 * Extensions will be called with this upon being setup.
 *
 * @param plugin The name of the plugin being executed.
 * @param command The name of the command being executed.
 * @param context The gluegun runtime context.
 */
export type GluegunExtensionAttacher = (
  plugin: string,
  command: string,
  context: GluegunRunContext,
) => { [name: string]: object }

export interface GluegunParameters {
  /**
   * The name of the plugin to run.
   */
  pluginName?: string

  /**
   * The raw command with any named parameters.
   */
  rawCommand?: string

  /**
   * Any optional parameters. Typically coming from command-line
   * arguments like this: `--force -p tsconfig.json`.
   */
  options?: { [name: string]: any }

  /** Everything else after the command as a string. */
  string?: string

  /** The command arguments as an array. */
  array?: string[]

  /** Just the first argument. */
  first?: string

  /** Just the 2nd argument. */
  second?: string

  /** Just the 3rd argument. */
  third?: string
}

export interface GluegunFilesystemAppendOptions {
  /** If the file doesn't exist yet, will be created with given mode. Value could be number (eg. 0o700) or string (eg. '700'). */
  mode?: string | number
}

/**
 * Used for resolving conflicts when performing copy oeperations.
 *
 * @param srcData The source inspect data.
 * @param destData The destination inspect data.
 * @returns Should we overwrite?
 */
export type GluegunFilesystemCopyResolveHandler = (srcData: any, destData: any) => boolean

export interface GluegunFilesystemCopyOptions {
  /** Should we overwrite? */
  overwrite?: boolean | GluegunFilesystemCopyResolveHandler
  /** A glob to filter down which files to copy. */
  matching?: string
}

export interface GluegunFilesystemDirOptions {
  /**
   * Whether directory should be empty (no other files or directories inside). If set to true and directory contains any files or subdirectories all of them will be deleted.
   */
  empty?: boolean
  /**
   * Ensures directory has specified mode. If not set and directory already exists, current mode will be preserved. Value could be number (eg. 0o700) or string (eg. '700').
   */
  mode?: string | number
}

export interface GluegunFilesystemFileOptions {
  /**
   * Sets file content. If Object or Array given to this parameter data will be written as JSON.
   */
  content?: any
  /**
   * If writing JSON data this tells how many spaces should one indentation have. default: 2
   */
  jsonIndent: number
  /**
   * Ensures file has specified mode. If not set and file already exists, current mode will be preserved. Value could be number (eg. 0o700) or string (eg. '700').
   */
  mode: string | number
}

export interface GluegunFilesystemFindOptions {
  /** An additional glob pattern to filter files. */
  matching?: string
  /** Should we find files? default: true */
  files?: boolean
  /** Should we find directories?: default: false */
  directories?: boolean
  /** Should we be recursive?: default: true */
  recursive?: boolean
  /** Should we report symlinks?: default false */
  symlinks?: boolean
}

export interface GluegunFilesystemExtensionExtra {
  /**
   * The end-of-line character which changes per-platform.
   */
  eol: string

  /**
   * The filesystem separator character.
   */
  separator: string

  /**
   * Find immediate subdirectories under a directory.
   */
  subdirectories: (path: string) => string[]
}

export interface GluegunFileSystemInspectOptions {
  /** Performs a checksum on the file. Ignore directories. */
  checksum?: 'md5' | 'sha1' | 'sha256' | 'sha512'
  /** Adds unix file permissionss. default: false */
  mode?: boolean
  /** Adds access, modified, and change times. default: false */
  times?: boolean
  /** Adds an absolute path. default: false */
  absolutePath?: boolean
  /** Report or follow symlinks. default: false */
  symlinks?: 'report' | 'follow'
}

export interface GluegunFileSystemInspectResult {
  /** The filename */
  name: string
  /** The type of resource. */
  type: 'file' | 'dir' | 'symlink'
  /** The size in bytes. */
  size: number
  /** The md5 if the checksum was set to `md5` */
  md5?: string
  /** The sha1 if the checksum was set to `sha1` */
  sha1?: string
  /** The sha256 if the checksum was set to `sha256` */
  sha256?: string
  /** The sha512 if the checksum was set to `sha512` */
  sha512?: string
  /** The unix permission mode */
  mode?: number
  /** Last accessed */
  accessTime?: Date
  /** Last modified */
  modifyTime?: Date
  /** Change time */
  changeTime?: Date
}

export interface GluegunFileSystemInspectTreeOptions {
  /** Performs a checksum on the file. Ignore directories. */
  checksum?: 'md5' | 'sha1' | 'sha256' | 'sha512'
  /** Adds an absolute path. default: false */
  relativePath?: boolean
  /** Report or follow symlinks. default: false */
  symlinks?: 'report' | 'follow'
}

export interface GluegunFileSystemInspectTreeResult {
  /** The filename */
  name: string
  /** The type of resource. */
  type: 'file' | 'dir' | 'symlink'
  /** The size in bytes. */
  size: number
  /** The relative path from the inspected directory. */
  relativePath?: string
  /** The md5 if the checksum was set to `md5` */
  md5?: string
  /** The sha1 if the checksum was set to `sha1` */
  sha1?: string
  /** The sha256 if the checksum was set to `sha256` */
  sha256?: string
  /** The sha512 if the checksum was set to `sha512` */
  sha512?: string
  /** Children results */
  children?: GluegunFileSystemInspectTreeOptions[]
}

export type GluegunFilesystemReadType =
  /** The utf-8 string (default) */
  | 'utf8'
  /** A Node Buffer */
  | 'buffer'
  /** An object converted from JSON. */
  | 'json'
  /** An object converted from JSON but with ISO dates converted. */
  | 'jsonWithDates'

export interface GluegunFilesystemWriteOptions {
  /**
   * A safer and slower way to write the file to disk. Default: false.
   */
  atomic?: boolean
  /**
   * If this is JSON, this will control the amount of indentation. Default: 2
   */
  jsonIndent?: number
}

export interface GluegunFilesystemJetpack {
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
  appendAsync: (
    path: string,
    data: string | Buffer,
    options?: GluegunFilesystemAppendOptions,
  ) => Promise<void>

  /** Copies given file or directory (with everything inside). */
  copy: (from: string, to: string, options?: GluegunFilesystemCopyOptions) => void

  /** Copies given file or directory (with everything inside). */
  copyAsync: (from: string, to: string, options?: GluegunFilesystemCopyOptions) => Promise<void>

  /** See Node's fs.createReadStream. */
  createReadStream: (path: string | Buffer | URL, options: any) => any

  /** See Node's fs.createWriteStream. */
  createWriteStream: (path: string | Buffer | URL, options: any) => any

  /** Returns Current Working Directory (CWD) for this instance of jetpack, or creates new jetpack object with given path as its internal CWD. */
  cwd: (...string) => any

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
  inspect: (
    path: string,
    options?: GluegunFileSystemInspectOptions,
  ) => GluegunFileSystemInspectResult[] | void

  /**
   * Returns details about a filesystem object found at a path.
   */
  inspectAsync: (
    path: string,
    options?: GluegunFileSystemInspectOptions,
  ) => Promise<GluegunFileSystemInspectResult[] | void>

  /**
   * Returns details about a filesystem tree found at the path.
   */
  inspectTree: (
    path: string,
    options?: GluegunFileSystemInspectTreeOptions,
  ) => GluegunFileSystemInspectTreeResult | void

  /**
   * Returns details about a filesystem tree found at the path.
   */
  inspectTreeAsync: (
    path: string,
    options?: GluegunFileSystemInspectTreeOptions,
  ) => Promise<GluegunFileSystemInspectTreeResult | void>

  /**
   * Lists the contents of directory.
   */
  list: (path?: string) => string[] | void

  /**
   * Lists the contents of directory.
   */
  listAsync: (path?: string) => Promise<string[] | void>

  /**
   * Moves given path to a new location.
   */
  move: (from: string, to: string) => void

  /**
   * Moves given path to a new location.
   */
  moveAsync: (from: string, to: string) => void

  /**
   * Resolves an absolute path.
   */
  path: (...string) => any

  /**
   * Reads the contents of a file.
   *
   * @param path The path to read from.
   * @param options Additional options.
   */
  read: (path: string, options?: GluegunFilesystemReadType) => string | Buffer | any

  /**
   * Reads the contents of a file.
   *
   * @param path The path to read from.
   * @param options Additional options.
   */
  readAsync: (path: string, options?: GluegunFilesystemReadType) => Promise<string | Buffer | any>

  /**
   * Deletes the path or file. It may or may not exist.
   */
  remove: (path?: string) => void

  /**
   * Deletes the path or file. It may or may not exist.
   */
  removeAsync: (path?: string) => Promise<void>

  /**
   * Renames a file or directory. The `to` is just the file name as this only renames in the same directory.
   */
  rename: (from: string, to: string) => void

  /**
   * Renames a file or directory. The `to` is just the file name as this only renames in the same directory.
   */
  renameAsync: (from: string, to: string) => Promise<void>

  /**
   * Creates a symlink.
   */
  symlink: (from: string, to: string) => void

  /**
   * Creates a symlink.
   */
  symlinkAsync: (from: string, to: string) => Promise<void>

  /**
   * Writes the contents of a file.
   */
  write: (path: string, data: any, options?: GluegunFilesystemWriteOptions) => void

  /**
   * Writes the contents of a file.
   */
  writeAsync: (path: string, data: any, options?: GluegunFilesystemWriteOptions) => Promise<void>
}

export interface GluegunStrings {
  /**
   * Returns itself.
   */
  identity(value: string): string
  /**
   * Is this string blank, null, or otherwise empty?
   */
  isBlank(value: string): boolean
  /**
   * This is not a string? Are you not entertained?
   */
  isNotString(value: any): boolean
  /**
   * Converts a string toCamelCase.
   */
  camelCase(value: string): string
  /**
   * Converts a string to-kebab-case.
   */
  kebabCase(value: string): string
  /**
   * Converts a string to_snake_case.
   */
  snakeCase(value: string): string
  /**
   * Converts a string TO UPPER CASE.
   */
  upperCase(value: string): string
  /**
   * Converts a string to lower case.
   */
  lowerCase(value: string): string
  /**
   * Converts a string To start case.
   */
  startCase(value: string): string
  /**
   * Converts the first character Of Every Word To Upper.
   */
  upperFirst(value: string): string
  /**
   * Converts the first character oF eVERY wORD tO lOWER.
   */
  lowerFirst(value: string): string
  /**
   * Converts a string ToPascalCase.
   */
  pascalCase(value: string): string
  /**
   * Pads a string with `chars` (spaces default) to `length` characters long, effectively centering the string.
   */
  pad(string: string, length: number, chars?: string): string
  /**
   * Pads the start of `string` with `chars` (spaces default) to `length` characters.
   */
  padStart(string: string, length: number, chars?: string): string
  /**
   * Pads the end of `string` with `chars` (spaces default) to `length` characters.
   */
  padEnd(string: string, length: number, chars?: string): string
  /**
   * Strips whitespace from a string.
   */
  trim(string: string, chars?: string): string
  /**
   * Strips whitespace from the start of a string.
   */
  trimStart(string: string, chars?: string): string
  /**
   * Strips whitespace from the end of a string.
   */
  trimEnd(string: string, chars?: string): string
  /**
   * Repeats a `string` a `numberOfTimes`.
   */
  repeat(string: string, numberOfTimes: number): string
}

export interface GluegunPrintExtensionExtra {
  /**
   * A green checkmark.
   */
  checkmark: string
  /**
   * A red X marks the spot.
   */
  xmark: string
  /**
   * An `ora` spinner.
   */
  spin(options: any): any
  /**
  * Print help info for CLI commands
  */
  printCommands(context: GluegunRunContext): void
}

export interface GluegunPrintUtils {
  info: (message: any) => void
  warning: (message: any) => void
  success: (message: any) => void
  error: (message: any) => void
  debug: (value: any, title?: string) => void
  /** DEPRECATED: prints a normal line of text. */
  fancy: (value: string) => void
  divider: () => void
  newline: () => void
  table: (data: any, options: any) => void
  /**
   * Colors as seen from colors.js.
   */
  colors: any
  color: any
}

/**
 * Returns the number of milliseconds from when the timer started.
 */
export type GluegunTimer = () => number

export interface GluegunSystem {
  /**
   * Executes a command via execa.
   */
  exec(command: string, options?: any): Promise<any>
  /**
   * Runs a commmand and returns stdout as a trimmed string.
   */
  run(command: string, options?: any): Promise<string>
  /**
   * Spawns a command via crosspawn.
   */
  spawn(command: string, options?: any): Promise<any>
  /**
   * Uses node-which to find out where the command lines.
   */
  which(command: string): string | void
  /**
   * Returns a timer function that starts from this moment. Calling 
   * this function will return the number of milliseconds from when
   * it was started.
   */
  startTimer(): GluegunTimer
}

export interface GluegunSemver {
  valid(version: string): string | null
  clean(version: string): string | null
  satisfies(version: string, inVersion: string): boolean
  gt(version: string, isGreaterThanVersion: string): boolean
  lt(version: string, isLessThanVersion: string): boolean
  validRange(range: string): boolean | null
}

export interface GluegunHttp {
  /**
   * An apisauce instance.
   */
  create(options: any): any
}

export interface GluegunPatchingPatchOptions {
  insert?: string
  before?: string
  after?: string
  replace?: string
  delete?: string
  force?: boolean
}

export interface GluegunPatching {
  /**
   * Updates a file.
   */
  update(filename: string, callback: (contents: any) => any): Promise<boolean>
  /**
   * Appends to the end of a file.
   */
  append(filename: string, contents: string): Promise<boolean>
  /**
   * Prepends to the start of a files.
   */
  prepend(filename: string, contents: string): Promise<boolean>
  /**
   * Replaces part of a file.
   */
  replace(filename: string, searchFor: string, replaceWith: string): Promise<boolean>
  /**
   * Makes a patch inside file.
   */
  patch(filename: string, options: GluegunPatchingPatchOptions): Promise<boolean>
}

export interface GluegunPrompt {
  confirm(message: string): Promise<boolean>
  ask(questions: any): any
  separator(): string
}

export interface GluegunTemplateGenerateOptions {
  /**
   * Path to the EJS template relative from the plugin's `template` directory.
   */
  template: string
  /**
   * Path to create the file relative from the user's working directory.
   */
  target?: string
  /**
   * Additional props to provide to the EJS template.
   */
  props?: { [name: string]: any }
  /**
   * An absolute path of where to find the templates (if not default).
   */
  directory?: string
}

export interface GluegunTemplate {
  generate(options: GluegunTemplateGenerateOptions): Promise<string>
}

export interface GluegunRunContext {
  /** The result of running a command. Rarely used. */
  result?: any

  /**
   * The runtime used to execute this runtime.  Also, I can't have
   * enough circular dependencies in my life.
   */
  runtime: GluegunRuntime

  /**
   * If an error happened during the run of a command, it will
   * be stored here so that you many pass it on to your children
   * for generations to come.
   */
  error?: Error

  /**
   * A mashup of the plugin's defaults and the user's overrides from
   * their configuration file.
   */
  config: any

  /** The input parameters from the user. */
  parameters: GluegunParameters

  /** Functions for working with strings. */
  strings: GluegunStrings

  /** Goodies for working with the filesystem. */
  filesystem: GluegunFilesystemJetpack & GluegunFilesystemExtensionExtra

  /** Executing & finding programs. */
  system: GluegunSystem

  /** Printing stuff to the CLI. */
  print: GluegunPrintExtensionExtra & GluegunPrintUtils

  /** Semantic versioning extensions. */
  semver: GluegunSemver

  /** Apisauce extension. */
  http: GluegunHttp

  /** Text patching services. */
  patching: GluegunPatching

  /** CLI prompting functions. */
  prompt: GluegunPrompt

  /** File generation functions. */
  template: GluegunTemplate
}

/**
 * Runs the user's commands by figuring out which of the
 * plugins to run.
 */
export interface GluegunRuntime {
  /**
   * Runs a command.
   *
   * When blank, the options will be read in the command line. This is typically
   * the scenario you want.
   *
   * When this is an object, the runtime will use these options instead of reading
   * from the command line. You can do this if you want to kick of your commands
   * manually.
   *
   * The 3rd option is an array of strings used to mimic the `process.argv` node
   * runtime. This is useful for testing or if you're completely off your gourd.
   * This one will be deprecated.
   */
  run(options?: GluegunRunOptions | string[]): Promise<GluegunRunContext>

  /**
   * Ideally named after the command line, the brand will be used
   * when searching for configuration files.
   */
  brand?: string

  /**
   * A list of available plugins.
   */
  readonly plugins: GluegunPlugin[]

  /**
   * A list of available extensions.
   */
  readonly extensions: GluegunExtension[]

  /**
   * Default values for the configuration of each plugin.
   */
  defaults?: { [pluginName: string]: any }

  /**
   * The plugin which will be used as a default, bypassing the
   * need use the plugin's name as a prefix to run one of
   * it's commands.
   */
  readonly defaultPlugin?: GluegunPlugin

  /**
   * The main configuration file. These will contain values that
   * the user has entered into their configuration file. If none
   * are given, it will fallback to the `defaults`.
   */
  config?: { [pluginName: string]: any }

  /**
   * Add this extension to the runtime. The extension will be available
   * on the run context with the object returned from the registration
   * call.
   *
   * You won't need to use this function if your extensions are dynamically
   * loaded from the plugin's `extensions` directory.
   *
   * @param name The name of the extension.
   * @param attach The extension setup function.
   */
  addExtension(name: string, attach: GluegunExtensionAttacher)

  /** A list of registered commands. */
  listCommands(): Array<{ plugin: GluegunPlugin; command: GluegunCommand }>

  /**
   * Finds a plugin by name.
   *
   * @param name The name of the plugin.
   */
  findPlugin(name: string): GluegunPlugin | void

  /**
   * Finds a command by plugin name and raw command.
   *
   * @param pluginName The name of the plugin.
   * @param rawCommand The raw command string (or alias).
   */
  findCommand(pluginName: string, rawCommand?: string): GluegunCommand | void
}

export interface GluegunLoadOptions {
  /**
   * Should we hide this plugin from showing up in the CLI? These types
   * of plugins will still be available to be called directly.
   */
  hidden?: boolean

  /**
   * The file pattern to use when auto-detecting commands. The default is `*.js`.
   *
   * If you are using `ts-node`, you can switch this to `*.ts` to pick up your
   * TypeScript-based commands.
   */
  commandFilePattern?: string

  /**
   * The file pattern is used when auto-detecting gluegun extensions.  The default
   * is `*.js`.
   *
   * If you are using `ts-node`, you can switch this to `*.ts` to pick up your
   * TypeScript-based extensions.
   */
  extensionFilePattern?: string
}

export interface GluegunMultiLoadOptions {
  /**
   * Filters the directories to those matching this glob-based pattern. The default
   * is `*` which is all the immediate sub-directories. Setting this to something
   * like `ignite-*` will only attempt to load plugins from directories that start
   * with `ignite-`.
   */
  matching?: string
}

/**
 * A builder in a fluent-api style which creates a Runtime.
 */
export interface GluegunBuilder {
  /**
   * Ideally named after the command line, the brand will be used
   * when searching for configuration files.
   *
   * @param name The name should be all lowercase and contains only numbers, letters, and dashes.
   */
  brand(name: string): GluegunBuilder

  /**
   * The name of the file to use for configuration options.
   *
   * @param filename A path to a TOML file to load configs.
   */
  configFile(filename: string): GluegunBuilder

  /**
   * Specifies where the default commands and extensions live.
   *
   * @param path The path to the source directory.
   * @param options Additional plugin loading options.
   */
  src(path: string, options?: GluegunLoadOptions): GluegunBuilder

  /**
   * Register a plugin.
   *
   * Plugins are directories.  Usually they have a sub-directory for the commands
   * called `commands`, and sometimes one for extensions called `extensions`.
   *
   * @param path The path to the plugin's directory.
   * @param options Additional plugin loading options.
   */
  plugin(path: string, options?: GluegunLoadOptions): GluegunBuilder

  /**
   * Register several plugins located under the parentPath.
   *
   * A common case is using `node_modules` as a parentPath.
   */
  plugins(
    parentPath: string,
    options?: GluegunLoadOptions & GluegunMultiLoadOptions,
  ): GluegunBuilder

  /**
   * Creates a runtime.
   *
   * Call this function when you are finished configuring the builder
   * with the other functions.
   */
  create(): GluegunRuntime
}

/**
 * Return a builder which makes a runtime.
 */
export function build(): GluegunBuilder

/**
 * Works with the filesystem.
 */
export const filesystem: GluegunFilesystemJetpack & GluegunFilesystemExtensionExtra

/**
 * Working with strings.
 */
export const strings: GluegunStrings

/**
 * Fun with printing stuff on the CLI.
 */
export const print: GluegunPrintUtils

/**
 * Executing and finding programs.
 */
export const system: GluegunSystem

/** Semantic versioning extensions. */
export const semver: GluegunSemver

/** Apisauce extension. */
export const http: GluegunHttp

/** Text patching services. */
export const patching: GluegunPatching

/** CLI prompting functions. */
export const prompt: GluegunPrompt

/** File generation functions. */
export const template: GluegunTemplate
