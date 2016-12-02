const R = require('ramda')

export default async () => {
  console.log('1...2...3...')
  return R.range(1, 4)
  // return [1, 2, 3]
}
