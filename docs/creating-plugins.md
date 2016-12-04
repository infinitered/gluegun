# Creating Plugins

A plugin is collection of any number of:

* scripts
* commands
* filters
* templates

which extends the `staple-gun` environment. These extensions generally have a
theme such as **react native**, **fastlane**, or even just **my sandbox**.


# Directory Structure

A plugin is a directory.

The only requirement is a `package.json` file. Which is the same one you'd use
for an NPM module making this NPM a great vehicle for distributing your plugins,
but also simple for extending existing projects.

# Structure

Inside the `package.json`, a new root element is needed called `staple-gun`. It
should be an object with a non-blank string value keyed by `namespace`.

This is a simplest `staple-gun` plugin you can have:

```json
{
  "staplegun": {
    "namespace": "hello"
  }
}
```

Now, it doesn't do very much, but no need to judge!

But this one... this one is going places:

```json
{
  "staplegun": {

    "namespace": "reactotron",

    "commands": [
      { "name":         "bootstrap native",
        "file":         "native.js",
        "description":  "Installs Reactotron into a React Native project." },

      { "name":         "bootstrap cra",
        "file":         "cra.js",
        "description":  "Installs Reactotron into a 'create-react-app' React JS app" },

      { "name":         "plugin blank",
        "file":         "plugin.js",
        "functionName": "blank",
        "description":  "Make your own Reactotron with a fresh start." },

      { "name":         "plugin loaded",
        "file":         "plugin.js",
        "functionName": "loaded",
        "description":  "Make your own Reactotron with every possible feature documented." },

      { "name":         "bug",
        "file":         "bug.js",
        "description":  "Report a bug so we can fix it for you." },

      { "name":         "twitter",
        "file":         "news.js",
        "description":  "Read what we're saying on Twitter." },
    ],

    "defaults": {
      "semicolons": false,
      "git":        "https://github.com/reactotron/staple-gun-reactotron",
      "branch":     "master"
    }

  }
}
```


## staplegun &gt; namespace
The namespace is a prefix to all your commands.

Since many plugins can be installed, we namespace them. If you're creating plugins
for others to use, try to be very specific about the name. Naming it after a project
is a good idea (e.g. 'ignite' or 'reactotron'). Calling it "dev" or "internet" is
probably asking for trouble.

If you're just making plugins for your project, then please, feel free to call it
whatever you'd like.

A namespace:

* can contain **numbers & letters**
* should be **lowercase**
* spaces-should-have-**dashes**-if-you-need-them

## staplegun &gt; commands

Commands are what people run from the command line. They are entry
points into your plugin.


## staplegun &gt; commands &gt; { } &gt; name

The name of the command that people will type.

In the above example, the user would type...

```sh
$ staple reactotron bug
```

...to run the command. The `reactotron` part is the `namespace` from above.

The command name:

* can contain **numbers & letters**
* should be **lowercase**
* spaces-should-have-**dashes**-if-you-need-them


## staplegun &gt; commands &gt; { } &gt; file

The JavaScript file that backs this command.

The path is relative to this plugin, so you can arrange your
sub-directories into whatever works for you.

These JavaScript files are ES6 and have access to most modern conveniences.

## staplegun &gt; commands &gt; { } &gt; functionName

The function inside the JS file that runs this command. When this property
is not included, it is assumed that the function to run is the default one
exported by your JavaScript file.

## staplegun &gt; commands &gt; { } &gt; description

A short description of what the command does.

The description should:

* be less than 100 characters
* start with a capital
* end with punctuation
* seriously? what am I? grammar police?


## 3rd Party Modules Available

| module     | purpose              |
|------------|----------------------|
| [inquirer.js](https://github.com/SBoudrias/Inquirer.js) | prompts & user input |
| [fs-jetpack](https://github.com/szwacz/fs-jetpack)      | files & folders |
| [nunjucks](https://github.com/mozilla/nunjucks)         | templates |
| [cross-env](https://github.com/kentcdodds/cross-env)    | executing programs |
| [axios](https://github.com/mzabriskie/axios)            | http requests |
| [lodash](https://github.com/lodash/lodash)              | utilities |
| [colors](https://github.com/Marak/colors.js)            | terminal code color |
| [string-table](https://github.com/dtao/string-table)    | terminal text tables |
| [ramda](https://github.com/ramda/ramda)                 | functional utilities |
| [ramdasauce](https://github.com/skellock/ramdasauce)    | functional utilities |

## Including Modules

> TODO: verify that this can be done.  We're talking about 2 different babel environments.

Nothing really changes here.  Just `yarn add` or `npm i --save` as usual.
