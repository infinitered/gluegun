export interface PackageJSON {
  name?: string
  version?: string
  description?: string
  keywords?: string[]
  homepage?: any
  bugs?: any
  license?: string
  author?: any
  contributors?: any[]
  maintainers?: any[]
  files?: string[]
  main?: string
  bin?: any
  types?: string
  typings?: string
  man?: string[]
  directories?: any
  repository?: any
  scripts?: {
    [k: string]: string
  }
  config?: {
    [k: string]: any
  }
  dependencies?: any
  devDependencies?: any
  optionalDependencies?: any
  peerDependencies?: any
  resolutions?: any
  engines?: {
    [k: string]: string
  }
  private?: boolean

  [k: string]: any
}
