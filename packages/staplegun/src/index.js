import minimist from 'minimist'
import { join, dissoc, length } from 'ramda'
import { isNilOrEmpty } from 'ramdasauce'
import jetpack from 'fs-jetpack'
import chalk from 'chalk'
import { leftPad } from './utils'

const configPath = './staplegun.toml'
const config = jetpack.read(configPath)

const p = jetpack.read(`${__dirname}/../package.json`, 'json')
const version = `${p.version}`
const versionPad = leftPad(Math.round((60 + length(version)) / 2), ' ', version)
const line = chalk.gray(leftPad(60, '-', ''))

const header = `          |              |                            
     ,---.|--- ,---.,---.|    ,---.    ,---..   .,---.
     \`---.|    ,---||   ||    |---'    |   ||   ||   |
     \`---'\`---'\`---^|---'\`---'\`---'    \`---|\`---'\`   '
                    |                  \`---'          `

if (!config) {
  // console.log(line)
  // console.log('')
  console.log(chalk.white(header))
  console.log('')
  console.log(chalk.yellow('           https://github.com/skellock/staplegun'))
  console.log(chalk.white(versionPad))
  console.log('')
  console.log(line)
}

// parse the command line into what we need
const args = minimist(process.argv.slice(2))
const commandArgs = args._
const commandOptions = dissoc('_', args)

console.log('')
console.log(`   config  |  ${isNilOrEmpty(config) ? chalk.red('missing') + chalk.gray(` (${configPath})`) : chalk.white(configPath)}`)
console.log(`  command  |  ${isNilOrEmpty(commandArgs) ? chalk.red('none') : chalk.white(join(' ', commandArgs))}`)
console.log(`  options  |  ${isNilOrEmpty(commandOptions) ? chalk.red('none') : chalk.white(JSON.stringify(commandOptions))}`)
console.log('')
console.log(line)
