const after = time => {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

async function hi() {
  await after(50)
  return 'hi'
}

module.exports = { hi }
