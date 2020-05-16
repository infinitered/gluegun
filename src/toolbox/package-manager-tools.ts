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
  let dev = ''
  if (options.dev) dev = yarn ? '--dev ' : '--save-dev '

  const command = `${yarn ? 'yarn add' : 'npm install'} ${dev}${concatPackages(packageName)}`
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
  const command = `${hasYarn() ? 'yarn remove' : 'npm uninstall'} ${concatPackages(packageName)}`
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
