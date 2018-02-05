/**
 * A flexible object for the many "options" objects we throw around in gluegun.
 */
export interface Options {
  [key: string]: any
}

/**
 * More specific options for loading plugins.
 */
export interface GluegunLoadOptions {
  /**
   * Should we hide this plugin from showing up in the CLI? These types
   * of plugins will still be available to be called directly.
   */
  hidden?: boolean

  /**
   * The file pattern to use when auto-detecting commands. The default is [`*.{js,ts}`, `!*.test.{js,ts}`].
   * The second matcher excludes test files with that pattern. The `ts` extension is only needed for loading
   * in a TypeScript environment such as `ts-node`.
   */
  commandFilePattern?: string[]

  /**
   * The file pattern is used when auto-detecting gluegun extensions.  The default
   * is [`*.{js,ts}`, `!*.test.{js,ts}`]. The `ts` extension is only needed for loading
   * in a TypeScript environment such as `ts-node`.
   */
  extensionFilePattern?: string[]

  /**
   * Specifies if the plugin is required to exist or not. If this is `true` and the plugin
   * doesn't exist, an Error will be thrown.
   */
  required?: boolean

  /**
   * Overrides the name of the plugin.
   */
  name?: string

  /**
   * Provides commands that are provided by the calling CLI rather than loaded from a file.
   */
  preloadedCommands?: object[]
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
