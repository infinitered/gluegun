/**
 * When we require this file, it'll blow up if we don't support async/await
 */
module.exports = async function () {
  const p = new Promise(resolve => resolve())
  await p
}
