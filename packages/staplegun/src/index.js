import 'babel-register'
import minimist from 'minimist'
import { forEach, head, slice, join, dissoc } from 'ramda'
import { isNilOrEmpty } from 'ramdasauce'
import jetpack from 'fs-jetpack'
import colors from 'colors'
import { drawHeader, drawLine, drawBlank, drawText } from './drawing'
import Runtime from './runtime'
import { rightPad } from './utils'
import getPluginDirectoriesFromPackage from './plugins-from-package'

// parse the command line into what we need
const args = minimist(process.argv.slice(2))
const namespace = head(args._)
const commandArgs = join(' ', slice(1, Infinity, args._))
const commandOptions = dissoc('_', args)

drawHeader()

// draw the status
drawBlank()
drawText(` ${colors.gray('namespace :')}  ${isNilOrEmpty(namespace) ? colors.red('none') : colors.yellow(namespace)}`)
drawText(`   ${colors.gray('command :')}  ${isNilOrEmpty(commandArgs) ? colors.red('none') : colors.yellow(commandArgs)}`)
drawText(`   ${colors.gray('options :')}  ${isNilOrEmpty(commandOptions) ? colors.red('none') : colors.yellow(JSON.stringify(commandOptions))}`)
drawBlank()
drawLine()

const runtime: Runtime = new Runtime()
runtime.addPluginFromDirectory(jetpack.cwd())
forEach(
  runtime.addPluginFromDirectory,
  getPluginDirectoriesFromPackage(jetpack.cwd())
)

// print the commands
drawBlank()
forEach(line => {
  const { plugin, command, description } = line
  const col1 = colors.white(rightPad(20, ' ', `${plugin} ${command}`))
  const col2 = colors.grey(description)
  drawText(`  ${col1} ${col2}`)
}, runtime.listCommands())
drawBlank()

runtime.run(namespace, commandArgs, commandOptions)
