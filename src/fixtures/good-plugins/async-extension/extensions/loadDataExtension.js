const after = time => {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

module.exports = async toolbox => {
  toolbox.asyncData = { a: 0 }
  await after(50)
  toolbox.asyncData = { a: 1 }
}
