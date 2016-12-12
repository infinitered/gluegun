// -=-=-=-=-=-=-=-=-
// Command Meta Data
// -=-=-=-=-=-=-=-=-
//
// You can control what shows up in the command line by tweaking these next
// lines.  If @cliCommand is not added in here, the name of the command is
// chosen based on the filename.  These need to be JavaScript comments
// because this is just a JS file.

// @cliCommand       flatter
// @cliDescription   Would you like to hear some straight talk?

// -=-=-=-=-=-=-=-=-=-=-=-=-=
// Built-in 3rd Party Modules
// -=-=-=-=-=-=-=-=-=-=-=-=-=
//
// Some libraries ship with included so you don't need to install
// extra libraries for the basics.

const { sample } = require('ramdasauce')
const { split, pipe, trim } = require('ramda')

// --- some others ---
// const lodash = require('lodash') // yup, this too!
// const ramda = require('ramda')
// const jetpack = require('fs-jetpack')
//
// --- and don't forget this is still NodeJS ---
// const path = require('path')
// const dns = require('dns')

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Bring Your Own 3rd Party Modules
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//
// You can still us your own node_modules if you'd like.  There's some examples
// of these plugins in the docs.
//
// const yeoman = require('yeoman') // i mean, sure, why not right?!

// -=-=-=-=-=-=-=-=-=
// Creating A Command
// -=-=-=-=-=-=-=-=-=
//
// Now here's where you come in.  What you in your plugins is up to you. But we
// provide you with a rich toolkit to get started with most things.
//
// Commands are simply async functions.
//
// The context argument that gets passed in contains properties like:
//
//   * `parameters` - the user's command line options and arguments
//   * `filesystem` - read/write/copy/move/delete files & directories
//   * `template`   - code generate some files
//   * `prompt`     - a set of command line user input goodies
//   * `print`      - prints text, colors, and tables to the command line
//   * `http`       - talk to the web & api servers
//   * `system`     - run some scripts or copy stuff to the clipboard
//   * `strings`    - common helper functions like `camelCase` and more
//
// See the context api docs for the big ol' list.

/**
 * Runs the flatter command.  Got a tough bug?  Maybe this will help!
 *
 * @param {RunContext} context The universe.
 */
module.exports = async function (context) {
  // let's grab a few things we'll need
  const { print, filesystem, template } = context

  // a path to a plugin-based text file
  const niceFilename = `${__dirname}/../stuff/flattery.txt`

  // find something nice to say
  const phrase = pipe(
    filesystem.read, // read it in as a string
    trim,            // pesky newline at the end of the file
    split('\n'),     // split
    sample,          // grab a random line
    trim             // clean that up too
  )(niceFilename)    // kick it off with the file name

  // let's generate a template and save it to a string
  const sentence = await template.generate({
    template: 'flatter.ejs',
    props: { phrase }
  })

  // print it in shiny green on the command line
  print.success(sentence)
}
