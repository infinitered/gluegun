Tools to help adjust the contents of text files.

## update

> This is an **async** function.

Updates a given file by reading it in and then taking the result of the provided callback and writing it back to the config file.

If the file ends in `.json`, it'll be read in as an object. Return the updated object to have it written back to the config.

If the file doesn't end in `.json`, you'll receive a string. Return an updated string to write back to the file.

```js
await context.patching.update('config.json', (config) => {
  config.key = 'new value'
  return config
})

await context.patching.update('config.txt', (data) => {
  return data.replace('Jamon', 'Boss')
})
```

## append

> This is an **async** function.

Appends a string to the given file.

```js
await context.patching.append('config.txt', 'Append this string\n')
```

## prepend

> This is an **async** function.

Prepends a string to the given file.

```js
await context.patching.prepend('config.txt', 'Prepend this string\n')
```

## replace

> This is an **async** function.

Replaces a string in a given file.

```js
await context.patching.replace('config.txt', 'Remove this string\n', 'Replace with this string\n')
```

## patch

> This is an **async** function.

Allows inserting next to, deleting, and replacing strings in a given file. If `insert` is already present in the file, it won't change the file, unless you also pass through `force: true`.

```js
await context.patching.patch('config.txt', { insert: 'Jamon', before: 'Something else' })
await context.patching.patch('config.txt', { insert: 'Jamon', after: 'Something else' })
await context.patching.patch('config.txt', { insert: 'Jamon', replace: 'Something else' })
await context.patching.patch('config.txt', { insert: 'Jamon', replace: 'Something else', force: true })
await context.patching.patch('config.txt', { delete: 'Something' })
```
