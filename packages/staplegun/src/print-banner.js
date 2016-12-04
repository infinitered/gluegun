// @flow
import print from './print'
import colors from 'colors'
import jetpack from 'fs-jetpack'
import { length } from 'ramda'
import { leftPad } from './utils'

const L33T_BRANDING = `          |              |
     ,---.|--- ,---.,---.|    ,---.    ,---..   .,---.
     \`---.|    ,---||   ||    |---'    |   ||   ||   |
     \`---'\`---'\`---^|---'\`---'\`---'    \`---|\`---'\`   '
                    |                  \`---'          `

// grab the version
const pkg = jetpack.read(`${__dirname}/../package.json`, 'json')
const version = `${pkg.version}`
const versionPad = leftPad(Math.round((60 + length(version)) / 2), ' ', version)

/**
 * Prints the bruce banner.
 */
export default function printBanner () {
  print.newline()
  print.freestyle(colors.white(L33T_BRANDING))
  print.newline()
  print.freestyle(colors.yellow('           https://github.com/skellock/staplegun'))
  print.freestyle(colors.white(versionPad))
  print.newline()
  print.divider()
}
