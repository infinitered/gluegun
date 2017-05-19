A convenience library that allows easy manipulation of files, such as config files.

# update

Updates a given file by reading it in and then taking the result of the provided callback and writing it back to the config file.

If the file ends in `.json`, it'll be read in as an object. Return the updated object to have it written back to the config.

If the file doesn't end in `.json`, you'll receive a string. Return an updated string to write back to the file.

```javascript
context.patching.update('config.json', (config) => {
  config['key'] = 'new value'
  return config
})

context.patching.update('config.txt', (data) => {
  data.replace('Jamon', 'Boss')
  return data
})
```



