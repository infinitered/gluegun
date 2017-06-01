# Sniff

The `gluegun` requires a Node 7.6.0 environment which provides `async` and `await` support natively.

You can safely check these requirements by using the `sniff` module.

```js
const { ok } = require('gluegun/sniff')

if (ok) {
  // we are clear for lift-off
}
```

The `ok` property will be `true` if everything is good to go.

`sniff` also has a few more properties you can use for better errors.

| property      | type   | value                                      |
| ------------- | ------ | ------------------------------------------ |
| ok            | bool   | `true` if everything is good to go         |
| isNewEnough   | bool   | `true` if we have Node.js >= 7.6.0         |
| hasAsyncAwait | bool   | `true` if we have `--harmony` enabled      |
| nodeVersion   | string | the node version such as `'7.6.0'`         |
| nodeMinimum   | string | the node minimum that sniff is looking for |

These two properties will both be set to `true` if we're running in Node 7.6.0.
