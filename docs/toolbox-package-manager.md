Provides an API for intelligently running commands in yarn or npm depending on which is installed.

## hasYarn

Whether the current system has yarn installed

```js
toolbox.packageManager.hasYarn() // true
```

## add (async)

Adds a package using yarn or npm

```js
await toolbox.packageManager.add('infinite_red', {
  dev: true,
  dryRun: false,
  force: 'npm', //remove this to have the system determine which
})
```

Will return an object similar to the following:

```js
{
  success: true,
  command: 'npm install --save-dev infinite_red',
  stdout: ''
}
```

You can also use an array with the package names you want to install to add it all at once.

```js
await toolbox.packageManager.add(['infinite_red', 'infinite_blue'], {
  dev: true,
  dryRun: false,
```

## remove (async)

Removes a package using yarn or npm

```js
await toolbox.packageManager.remove('infinite_red', {
  dryRun: false,
  force: 'npm', //remove this to have the system determine which
})
```

Like `add` function, you can also use an array to remove multiple packages.

```js
await toolbox.packageManager.remove(['infinite_red', 'infinite_blue'], {
  dryRun: false,
})
```
