export default env => {
  const { addCommand } = env

  addCommand('identity', x => x)
  addCommand('identity', x => x)
}
