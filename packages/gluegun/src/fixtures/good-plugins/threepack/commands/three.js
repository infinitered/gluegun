const R = require('ramda')

async function three () {
  return R.range(1, 4)
}

module.exports = { name: 'three', run: three }
