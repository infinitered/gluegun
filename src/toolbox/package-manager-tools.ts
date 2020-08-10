import {
  GluegunPackageManager,
  GluegunPackageManagerOptions,
  GluegunPackageManagerResult,
} from './package-manager-types'
import { system } from './system-tools'

let yarnpath

const hasYarn = () => {
  if (yarnpath === undefined) {
    yarnpath = system.which('yarn')
  }
  return Boolean(yarnpath)
}

const concatPackages = packageName => (Array.isArray(packageName) ? packageName.join(' ') : packageName)

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
}

export { packageManager, GluegunPackageManager }
