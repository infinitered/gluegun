const { range } = require('ramda')

async function three () {
  return range(1, 4)
}

module.exports = { name: 'three', run: three }
