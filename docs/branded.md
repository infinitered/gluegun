# Branded Mode

`gluegun` has the ability to run in branded mode.

To enable this (for now), setup up an alias

```sh
alias brand='node --harmony /full/path/to/this/repo/packages/gluegun/src/index.js --gluegun-brand brand'
```

This impacts a few things:

* The command line program is now `brand` (we're cheating with aliases until beta 1)
* The `gluegun.toml` config file the project directory becomes `brand.toml`.
* The project's plugin directory is now called `brand`.
* The project's plugin config file now called `brand.toml`.
* The CLI will now omit your namespace and give priority to running commands there.

So instead of people typing:

```sh
gluegun ignite generate component MyComponent
```

They type:

```sh
ignite generate component MyComponent
```
