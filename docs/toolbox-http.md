Gives you the ability to talk to HTTP(s) web and API servers using [apisauce](https://github.com/skellock/apisauce) which
is a thin wrapper around [axios](https://github.com/mzabriskie/axios).

You can access these tools on the Gluegun toolbox, via `const { http } = require('gluegun')`, or directly via `const { http } = require('gluegun/http')`.

## create

This creates an `apisauce` client. It takes 1 parameter called `options` which is an object.

```js
const api = toolbox.http.create({
  baseURL: 'https://api.github.com',
  headers: { Accept: 'application/vnd.github.v3+json' },
})
```

Once you have this api object, you can then call `HTTP` verbs on it. All verbs are `async` so don't forget your `await` call.

```js
// GET
const { ok, data } = await api.get('/repos/skellock/apisauce/commits')

// and others
api.get('/repos/skellock/apisauce/commits')
api.head('/me')
api.delete('/users/69')
api.post('/todos', {note: 'jump around'}, {headers: {'x-ray': 'machine'}})
api.patch('/servers/1', {live: false})
api.put('/servers/1', {live: true})
```
