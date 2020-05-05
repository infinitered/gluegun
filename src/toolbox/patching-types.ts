export interface GluegunPatching {
  /**
   * Checks if a string or pattern exists in a file.
   */
  exists(filename: string, findPattern: string | RegExp): Promise<boolean>
  /**
   * Updates a file.
   */
  update(filename: string, callback: (contents: any) => any): Promise<string | object | boolean>
  /**
   * Appends to the end of a file.
   */
  append(filename: string, contents: string): Promise<string | boolean>
  /**
   * Prepends to the start of a files.
   */
  prepend(filename: string, contents: string): Promise<string | boolean>
  /**
   * Replaces part of a file.
   */
  replace(filename: string, searchFor: string, replaceWith: string): Promise<string | boolean>
  /**
   * Makes a patch inside file.
   */
  patch(filename: string, ...options: GluegunPatchingPatchOptions[]): Promise<string | boolean>
}

export interface GluegunPatchingPatchOptions {
  /* String to be inserted */
  insert?: string
  /* Insert before this string */
  before?: string | RegExp
  /* Insert after this string */
  after?: string | RegExp
  /* Replace this string */
  replace?: string | RegExp
  /* Delete this string */
  delete?: string | RegExp
  /* Write even if it already exists  */
  force?: boolean
}
