Information about how the command was invoked. You can access this on the Gluegun toolbox. Check out this example of creating a new Reactotron plugin.

```sh
gluegun reactotron plugin MyAwesomePlugin full --comments --lint standard
```

| name        | type   | purpose                           | from the example above               |
| ----------- | ------ | --------------------------------- | ------------------------------------ |
| **plugin**  | string | the plugin used                   | `'reactotron'`                       |
| **command** | string | the command used                  | `'plugin'`                           |
| **string**  | string | the command arguments as a string | `'do thing'`                         |
| **array**   | array  | the command arguments as an array | `['MyAwesomePlugin', 'full']`        |
| **first**   | string | the 1st argument                  | `'MyAwesomePlugin'`                  |
| **second**  | string | the 2nd argument                  | `'full'`                             |
| **third**   | string | the 3rd argument                  | `undefined`                          |
| **options** | object | command line options              | `{comments: true, lint: 'standard'}` |
| **argv**    | object | raw argv                          |                                      |

## options

Options are the command line flags. Always exists however it may be empty.

```sh
gluegun say hello --loud -v --wave furiously
```

```js
module.exports = async function(toolbox) {
  toolbox.parameters.options // { loud: true, v: true, wave: 'furiously' }
}
```

## string

Everything else after the command as a string.

```sh
gluegun say hello there
```

```js
module.exports = async function(toolbox) {
  toolbox.parameters.string // 'hello there'
}
```

## array

Everything else after the command, but as an array.

```sh
gluegun reactotron plugin full
```

```js
module.exports = async function(toolbox) {
  toolbox.parameters.array // ['plugin', 'full']
}
```

## first / .second / .third

The first, second, and third element in `array`. It is provided as a shortcut, and there isn't one,
this will be `undefined`.

```sh
gluegun reactotron plugin full
```

```js
module.exports = async function(toolbox) {
  toolbox.parameters.first // 'plugin'
  toolbox.parameters.second // 'full'
  toolbox.parameters.third // undefined
}
```
