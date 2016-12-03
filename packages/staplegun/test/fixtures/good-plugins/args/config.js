export default (context) => {
  return context && context.config && context.config.color || 'red'
}
