export interface GluegunPatching {
  /**
   * Checks if a string or pattern exists in a file.
   */
  exists(filename: string, findPattern: string | RegExp): Promise<boolean>
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

export interface GluegunPatchingPatchOptions {
  /* String to be inserted */
  insert?: string
  /* Insert before this string */
  before?: string
  /* Insert after this string */
  after?: string
  /* Replace this string */
  replace?: string
  /* Delete this string */
  delete?: string
  /* Write even if it already exists  */
  force?: boolean
}
