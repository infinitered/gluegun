module.exports = {
  name: 'new',
  alias: [ 'n', 'create' ],
  description: 'Creates a new gluegun cli',
  hidden: false,
  run: async (context) => { console.log('new'); return `new ${context.parameters.first}` }
}
