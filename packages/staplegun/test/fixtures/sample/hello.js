function sayHello () {
  console.log('hello there!')
}

export default registry => {
  registry.addScript('hello', sayHello)
}
