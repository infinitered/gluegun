import minimist from 'minimist'
import { join, dissoc } from 'ramda'
import { isNilOrEmpty } from 'ramdasauce'
import jetpack from 'fs-jetpack'
import chalk from 'chalk'
import { drawHeader, drawLine, drawBlank, drawText } from './drawing'

// parse the command line into what we need
const args = minimist(process.argv.slice(2))
const commandArgs = args._
const commandOptions = dissoc('_', args)

// config file
const configPath = './staplegun.toml'    // the config to use
const config = jetpack.read(configPath)  // try reading the config

// draw a header if haven't found one
if (!config) {
  drawHeader()
}

// draw the status
drawBlank()
drawText(`   ${chalk.gray('config  :')}  ${isNilOrEmpty(config) ? chalk.red('missing') + chalk.white(` (${configPath})`) : chalk.white(configPath)}`)
drawText(`  ${chalk.gray('command  :')}  ${isNilOrEmpty(commandArgs) ? chalk.red('none') : chalk.white(join(' ', commandArgs))}`)
drawText(`  ${chalk.gray('options  :')}  ${isNilOrEmpty(commandOptions) ? chalk.red('none') : chalk.white(JSON.stringify(commandOptions))}`)
drawBlank()
drawLine()
