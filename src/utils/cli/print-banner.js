const print = require('../utils/print')
const colors = require('colors')
const jetpack = require('fs-jetpack')
const { split } = require('ramda')

// grab ze files
const BANNER = split('\n', jetpack.read(`${__dirname}/banner.txt`))
const pkg = jetpack.read(`${__dirname}/../../package.json`, 'json')

/**
 * Prints the bruce banner.
 */
function printBanner () {
  print.newline()
  print.fancy(colors.random(BANNER[0]))
  print.fancy(colors.random(BANNER[1]))
  print.fancy(colors.random(BANNER[2]))
  print.fancy(colors.random(BANNER[3]))
  print.fancy(colors.random(BANNER[4]))
  print.fancy(colors.random(BANNER[5]))
  print.fancy(colors.random(BANNER[6]))
  print.fancy(colors.random(BANNER[7]))
  print.newline()
  print.newline()
  print.fancy(colors.yellow('  https://github.com/infinitered/gluegun'))
  print.fancy(colors.white(`  ${pkg.version}`))
  print.newline()
  print.divider()
}

module.exports = printBanner
