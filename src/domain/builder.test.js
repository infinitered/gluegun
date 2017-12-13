const test = require('ava')
const build = require('./builder')

test('the gauntlet', t => {
  const brand = 'test'
  const builder = build()
    .brand(brand)
    // plugins
    .src(`${__dirname}/../fixtures/good-plugins/threepack`)
    .plugin(`${__dirname}/../fixtures/good-plugins/simplest`)
    .plugins(`${__dirname}/../fixtures/good-plugins`, { hidden: true })

  // the the builder
  t.is(builder.brand, 'test')

  const runtime = builder.create()
  t.truthy(runtime)
})
