/**
 * When we require this file, it'll blow up if we don't support async/await
 */
export default async function() {
  await new Promise(resolve => resolve())
}
