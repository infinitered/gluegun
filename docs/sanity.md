# Sanity Check

The `gluegun-core` requires a Node 7.x environment with the `--harmony` switch set to provide `async` and `await` support.

You can safely check these requirements by using the `sanity` module.

```js
const { ok } = require('gluegun-core/sanity')

if (ok) {
  // we are clear for lift-off
}
```

The `ok` property will be `true` if everything is good to go.

Sanity also has a few more properties you can use for better errors.

property      | type   | value
--------------|--------|-------------------
ok            | bool   | `true` if everything is good to go
isNewEnough   | bool   | `true` if we have Node.js 7+
hasAsyncAwait | bool   | `true` if we have `--harmony` enabled
nodeVersion   | string | the node version such as `'7.2.1'`

These two properties will both be set to `true` if we're running in Node 7.x and we have access to the `async` and `await` keywords. 
