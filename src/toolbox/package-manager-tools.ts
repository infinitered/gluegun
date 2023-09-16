import type {
  GluegunPackageManager,
  GluegunPackageManagerOptions,
  GluegunPackageManagerResult,
  PackageManager,
} from './package-manager-types'
import { system } from './system-tools'

const managerPath = {
  bun: undefined,
  yarn: undefined,
  npm: undefined,
}

const has = (manager: PackageManager) => {
  if (managerPath[manager] === undefined) managerPath[manager] = system.which(manager)
  return Boolean(managerPath[manager])
}

// for backwards compatability only
const hasYarn = () => has('yarn')

const concatPackages = (packageName) => (Array.isArray(packageName) ? packageName.join(' ') : packageName)

const which = (managers: PackageManager[]): PackageManager => {
  for (const manager of managers) {
    if (has(manager)) return manager
  }
  return 'npm'
}

const add = async (
  packageName: string | string[],
  options: GluegunPackageManagerOptions,
): Promise<GluegunPackageManagerResult> => {
  const yarn = options.force === undefined ? hasYarn() : options.force === 'yarn'
  const dev = options.dev ? (yarn ? '--dev ' : '--save-dev ') : ''
  const folder = options.dir ? options.dir : '.'

  const command = `${yarn ? 'yarn add --cwd' : 'npm install --prefix'} ${folder} ${dev}${concatPackages(packageName)}`
  let stdout
  if (!options.dryRun) {
    stdout = await system.run(command)
  }
  return { success: true, command, stdout }
}

const remove = async (
  packageName: string | string[],
  options: GluegunPackageManagerOptions,
): Promise<GluegunPackageManagerResult> => {
  const folder = options.dir ? options.dir : '.'
  const command = `${hasYarn() ? 'yarn remove --cwd' : 'npm uninstall --prefix'} ${folder} ${concatPackages(
    packageName,
  )}`
  let stdout
  if (!options.dryRun) {
    stdout = await system.run(command)
  }
  return { success: true, command, stdout }
}

const packageManager: GluegunPackageManager = {
  add,
  remove,
  hasYarn,
  has,
  which,
}

export { packageManager, GluegunPackageManager }
