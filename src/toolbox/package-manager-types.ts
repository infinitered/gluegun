export type GluegunPackageManagerOptions = {
  dev?: boolean
  dryRun?: boolean
  dir?: string
  force?: 'npm' | 'yarn'
}
export type GluegunPackageManagerResult = {
  success: boolean
  command: string
  stdout: string
  error?: string
}
export type GluegunPackageManager = {
  add: (packageName: string | string[], options: GluegunPackageManagerOptions) => Promise<GluegunPackageManagerResult>
  remove: (
    packageName: string | string[],
    options: GluegunPackageManagerOptions,
  ) => Promise<GluegunPackageManagerResult>
  hasYarn: () => boolean
}
