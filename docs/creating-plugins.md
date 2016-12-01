# Creating Plugins

A plugin is collection of any number of:

* scripts
* commands
* filters
* templates 

which extends the `staple-gun` environment.  These extensions generally have a
theme such as **react native**, **fastlane**, or even just **my sandbox**.


# Directory Structure

A plugin is a directory.

It requires a:
* a `plugin.toml` file
* a `package.json` file (the same NPM module)


You're free to create any other directories, but these have special meaning.

# plugin.toml

This is the format of the configuration file which accompanies your plugin.

I've divided up these into sections to exlain things as we go, but the `plugin.toml`
file is a single file.  Everything that appears in the code blocks are the lines
that go in the file.  Sorry if that seems obvious, just wanted to kind state that
explicitly.

# Example

```toml
[plugin]
namespace   = 'reactotron'

[config]
semicolons  = false

[[command]]
name        = 'setup config'
file        = 'setup.js'
description = 'Creates a Reactotron config file specified directory.'

[[command]]
name        = 'version'
file        = 'version.js'
description = 'Checks to see if there are new versions available.'
```


# Plugin

This section outlines details about the plugin.

```toml
[plugin]
```
The square brackets mean that this is an object.


## namespace
The namespace is a prefix to all your commands.

```toml
namespace = 'ignite'
```

Since many plugins can be installed, we namespace them. If you're creating plugins
for others to use, try to be very specific about the name.  Naming it after a project
is a good idea (e.g. 'ignite' or 'reactotron').  Calling it "dev" or "internet" is
probably asking for trouble.

Users can change this namespace from inside their project.

A namespace:

* can contain **numbers & letters**
* should be **lowercase** 
* spaces-should-have-**dashes**-if-you-need-them

The **default value** is the name of the plugin directory.


# Command

Commands are what people run from the command line.  They are entry
points into your plugin.

The `[[command]]` has an extra set of brackets because its a list of
objects. 



## name

The name of the command that people will type.

```toml
name = 'setup config'
```

In the above example, the user would type `staple reactotron setup config`
to run the command.  The `reactotron` part is the `namespace` defined in
`[plugin]` section at the top of the file.

The command name:

* can contain **numbers & letters**
* should be **lowercase** 
* spaces-should-have-**dashes**-if-you-need-them


## file

The JavaScript file that backs this command.

```toml
file = 'version.js'
```

The path is relative to this plugin, so you can arrange your
sub-directories into whatever works for you.

These JavaScript files


## description

A short description of what the command does.

```toml
description = 'Checks to see if there are new versions available.'
```

The description should:

* be less than 100 characters
* start with a capital
* end with punctuation
* what am I?  grammar police?



