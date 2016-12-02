const after = time => {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

export async function hi () {
  await after(50)
  return 'hi'
}
