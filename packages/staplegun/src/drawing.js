// @flow
import colors from 'colors'
import { length } from 'ramda'
import { leftPad } from './utils'
import jetpack from 'fs-jetpack'

// use this to draw
const log = console.log

// grab the package.json
const pkg = jetpack.read(`${__dirname}/../package.json`, 'json')

// grab the version
const version = `${pkg.version}`

const versionPad = leftPad(Math.round((60 + length(version)) / 2), ' ', version)

const HEADER = `          |              |
     ,---.|--- ,---.,---.|    ,---.    ,---..   .,---.
     \`---.|    ,---||   ||    |---'    |   ||   ||   |
     \`---'\`---'\`---^|---'\`---'\`---'    \`---|\`---'\`   '
                    |                  \`---'          `

const LINE = colors.gray(leftPad(60, '-', ''))

/**
 * Draws some text.
 */
export function drawText (text: ?string): void {
  log(text)
}

/**
 * Draw a line.
 */
export function drawLine (): void {
  drawText(LINE)
}

/**
 * Draw a blank line.
 */
export function drawBlank (): void {
  drawText('')
}

/**
 * Draw the header
 */
export function drawHeader (): void {
  drawBlank()
  drawText(colors.white(HEADER))
  drawBlank()
  drawText(colors.yellow('           https://github.com/skellock/staplegun'))
  drawText(colors.white(versionPad))
  drawBlank()
  drawLine()
}
