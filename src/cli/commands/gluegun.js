require('./help')

module.exports = {
  name: 'gluegun',
  description: 'Run the gluegun CLI',
  run: (context) => {
    const data = [
      ['liam', '5'],
      ['matthew', '2']
    ]

    console.log('gluegun')
    context.print.table(data)
    return 'default command'
  }
}
