export default env => {
  const { addScript } = env

  addScript('identity', x => x)
  addScript('identity', x => x)
}
