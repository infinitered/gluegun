import minimist from 'minimist'
import { forEach, head, slice, join, dissoc } from 'ramda'
import { isNilOrEmpty } from 'ramdasauce'
import jetpack from 'fs-jetpack'
import chalk from 'chalk'
import { drawHeader, drawLine, drawBlank, drawText } from './drawing'
import Runtime from './runtime'
import { rightPad } from './utils'

// parse the command line into what we need
const args = minimist(process.argv.slice(2))
const namespace = head(args._)
const commandArgs = join(' ', slice(1, Infinity, args._))
const commandOptions = dissoc('_', args)

drawHeader()

// draw the status
drawBlank()
drawText(` ${chalk.gray('namespace :')}  ${isNilOrEmpty(namespace) ? chalk.red('none') : chalk.yellow(namespace)}`)
drawText(`   ${chalk.gray('command :')}  ${isNilOrEmpty(commandArgs) ? chalk.red('none') : chalk.yellow(commandArgs)}`)
drawText(`   ${chalk.gray('options :')}  ${isNilOrEmpty(commandOptions) ? chalk.red('none') : chalk.yellow(JSON.stringify(commandOptions))}`)
drawBlank()
drawLine()

const runtime: Runtime = new Runtime()
runtime.addPluginFromDirectory(`${__dirname}/../test/fixtures/good-plugins/threepack`)
runtime.addPluginFromDirectory(jetpack.cwd())

// print the commands
drawBlank()
forEach(line => {
  const { plugin, command, description } = line
  const col1 = chalk.white(rightPad(20, ' ', `${plugin} ${command}`))
  const col2 = chalk.grey(description)
  drawText(`  ${col1} ${col2}`)
}, runtime.listCommands())
drawBlank()

runtime.run(namespace, commandArgs, commandOptions)

