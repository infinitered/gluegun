const print = require('./print')
const colors = require('colors')
const jetpack = require('fs-jetpack')
const { length } = require('ramda')
const { leftPad } = require('./utils')

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
function printBanner () {
  print.newline()
  print.fancy(colors.white(L33T_BRANDING))
  print.newline()
  print.fancy(colors.yellow('           https://github.com/skellock/staplegun'))
  print.fancy(colors.white(versionPad))
  print.newline()
  print.divider()
}

module.exports = printBanner
