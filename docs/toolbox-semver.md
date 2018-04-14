A set of functions & values to work with semantic versions. The majority of these functions come
straight from [semver](https://github.com/npm/node-semver)

You can access these tools on the Gluegun toolbox, via `const { semver } = require('gluegun')`, or directly via `const { semver } = require('gluegun/semver')`.

## Usage

All your common semver needs are accessible.

```js
// Step 1: grab from toolbox
const semver = { toolbox }

// Step 2: start using
semver.valid('1.2.3') // '1.2.3'
semver.valid('a.b.c') // null
semver.clean('  =v1.2.3   ') // '1.2.3'
semver.satisfies('1.2.3', '1.x || >=2.5.0 || 5.0.0 - 7.2.3') // true
semver.gt('1.2.3', '9.8.7') // false
semver.lt('1.2.3', '9.8.7') // true
```
