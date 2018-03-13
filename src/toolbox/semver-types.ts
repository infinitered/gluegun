export interface GluegunSemver {
  /* Checks if a version is a valid semver string */
  valid(version: string): string | null
  /* Removes extraneous characters from a semver string */
  clean(version: string): string | null
  /* Checks if a version is in a semver range */
  satisfies(version: string, inVersion: string): boolean
  /* Checks if a version is greater than another version */
  gt(version: string, isGreaterThanVersion: string): boolean
  /* Checks if a version is less than another version */
  lt(version: string, isLessThanVersion: string): boolean
  /* Checks if a range string is valid */
  validRange(range: string): boolean | null
}
