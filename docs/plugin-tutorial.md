#  Plugin Tutorial - JavaScript

When installed globally it is very trivial to create plugins.

Let's get started.  This will be lame, but very quick.

## Creating The `staple-loves` Plugin

* Create a new directory called `staple-loves`. Seriously. It's awesome.
* `cd staple-loves`
* Make a `package.json` file.
* Here we started with `name` and `version`.
* Then add a `staplegun` object like below.

```js
// package.json (don't include this line -- JSON gets grumpy)
{
  "name": "staple-loves",
  "version": "0.0.7",

  "staplegun": {
    "namespace": "loves",
    "commands":  [],
    "defaults":  {}
  }
}
```
> Notice at this point we don't even have `dependencies` or `devDependencies`!  
> If you stick to the build-in modules, you won't need them.


Even though you have no code, if you open a terminal to this directory and type:

```sh
$ staple loves
```
It will list the commands available.  Which are nothing.  So let's create some.

**What's that namespace thing?**

`loves` it's a random name we just came up with to group our commands together.
As long as it's unique, you'll get along just fine.  We could have called it `jimmy`.


## Let's Make a Command

A command is a function.  

It gets registered in the `commands` section you saw above.
They live inside `*.js` files that live in this directory (or any sub-directory below).

Here's a plugin that does very little.  It lives in `test.js` and exports a function
(`ES6` in this example).

```js
// test.js
module.exports = () => {
  console.log('🦄 ')
}
```

> SAD DEVELOPER SAYS,
>
> I'm still working through the right mix of babel, nodejs, and sanity.  I'd like
> to be as inclusive as possible, but no default `import` support in nodejs is making things
> challenging.

Then we register it in `package.json` under the `commands` array.

```js
// package.json
// ...commands: [
     {
       "name": "you",
       "file": "test.js",
       "description": "You know what's better than a pony?"
     }
// ]...
```

Now type:
```sh
$ staple loves you
```

And it runs!

:shipit:

Completely useless.  [Until we...](./part-2.md)
