export default env => {
  const { addFilter } = env

  addFilter('identity', x => x)
  addFilter('identity', x => x)
}
