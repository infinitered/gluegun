async function thrower (context) {
  throw new Error('thrown an error!')
}

module.exports = { name: 'throw', run: thrower }
