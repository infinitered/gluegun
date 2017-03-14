# Inside Context

So you're making a plugin. Let's get started.

```js
module.exports = async function (context) {
  
  // great! now what?

}
```

Here's what's available inside `context` object.

name            | provides the...                                     | 3rd party 
----------------|-----------------------------------------------------|--------
**parameters**  | command line arguments and options                  | minimist
**config**      | configuration options from the app or plugin        | 
**print**       | tools to print output to the command line           | colors, ora
**template**    | code generation from templates                      | ejs
**prompt**      | tools to acquire extra command line user input      | enquirer
**filesystem**  | ability to copy, move & delete files & directories  | fs-jetpack
**system**      | ability to execute & copy to the clipboard          | node-which, execa, cross-spawn
**http**        | ability to talk to the web                          | apisauce
**strings**     | some string helpers like case conversion, etc.      | lodash & ramda

If this is starting to sound like a scripting language, then good.  That's exactly how to think of it.  Except
we're not inventing another language.  And we're still running in a `node.js` environment, so you can do whatever you want.

