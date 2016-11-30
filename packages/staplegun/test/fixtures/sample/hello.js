function sayHello () {
  console.log('hello there!')
}

function setup (registry) {
  registry.addScript('hello', sayHello)
}

module.exports = setup
