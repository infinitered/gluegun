// check the node version
const sniff = require('gluegun/sniff')

// check the node version
if (!sniff.isNewEnough) {
  console.log(
    'Node.js 7.6+ is required to run. You have ' +
      sniff.nodeVersion +
      '. Womp, womp.'
  )
  process.exit(1)
}
