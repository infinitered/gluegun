This is an object. Each plugin will have its own root level key.

It takes the plugin's defaults, and merges the user's changes overtop.

```js
module.exports = async function(toolbox) {
  toolbox.config.myPlugin // { fun: true, level: 10 }
}
```
