export default async (context) => {
  return context && context.config && context.config.color || 'red'
}
