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
  pad(sourceString: string, length: number, chars?: string): string
  /**
   * Pads the start of `string` with `chars` (spaces default) to `length` characters.
   */
  padStart(sourceString: string, length: number, chars?: string): string
  /**
   * Pads the end of `string` with `chars` (spaces default) to `length` characters.
   */
  padEnd(sourceString: string, length: number, chars?: string): string
  /**
   * Strips whitespace from a string.
   */
  trim(sourceString: string, chars?: string): string
  /**
   * Strips whitespace from the start of a string.
   */
  trimStart(sourceString: string, chars?: string): string
  /**
   * Strips whitespace from the end of a string.
   */
  trimEnd(sourceString: string, chars?: string): string
  /**
   * Repeats a `string` a `numberOfTimes`.
   */
  repeat(sourceString: string, numberOfTimes: number): string
  /**
   * Pluralize or singularize a word based on the passed in count.
   */
  pluralize(word: string, count?: number, inclusive?: boolean): string
  /**
   * Pluralize a word based.
   */
  plural(word: string): string

  /**
   * Singularize a word based.
   */
  singular(word: string): string

  /**
   * Add a pluralization rule to the collection.
   */
  addPluralRule(rule: string | RegExp, replacement: string): void

  /**
   * Add a singularization rule to the collection.
   */
  addSingularRule(rule: string | RegExp, replacement: string): void

  /**
   * Add an irregular word definition.
   */
  addIrregularRule(single: string, plural: string): void

  /**
   * Add an uncountable word rule.
   */
  addUncountableRule(word: string | RegExp): void

  /**
   * Test if provided word is plural.
   */
  isPlural(word: string): boolean

  /**
   * Test if provided word is singular.
   */
  isSingular(word: string): boolean
}
