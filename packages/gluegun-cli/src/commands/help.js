module.exports = {
  name: 'help',
  alias: [ 'h' ],
  description: 'Displays this help',
  hidden: false,
  run: (context) => { console.log('help'); return 'helped' }
}
