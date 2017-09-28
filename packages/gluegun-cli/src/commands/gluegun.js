const helpCommand = require('./help')

module.exports = {
  name: 'gluegun',
  description: 'Run the gluegun CLI',
  run: () => { console.log('gluegun'); return 'default command' }
}
