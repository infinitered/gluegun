This is an object. Each plugin will have it's own root level key. 

It takes the plugin's defaults, and merges the user's changes overtop.

```js
module.exports = async function (context) {
  context.config.myPlugin // { fun: true, level: 10 }
}
```
