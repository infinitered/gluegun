# Creating Plugins

A plugin is collection of any number of:

* scripts
* commands
* filters
* templates 

which extends the `staple-gun` environment.  These extensions generally have a
theme such as **react native**, **fastlane**, or even just **my sandbox**.

# First Steps

A plugin is a directory.

The simplest plugin you can make is an empty directory!

And that's not helpful in the least so, let's start with this.

## plugin.toml

This is your [TOML](./what-is-toml.md) configuration file.  

It's a manifest on how your plugin extends the `staple-gun` landscape.

Everything located in `plugin.toml` is optional.  Sane defaults are baked-in
and you only need edit your `plugin.toml` should you want to.  And you'll 
want to.


# Directory Structure

### /plugin.toml


### /scripts/*.js

The entry points into your plugin.  This is what folks will be typing on 
the command line to run things you make.  These will be JavaScript (ES6) 
*.js files.

examples:  hello.js, generate.js, clean.js

### /commands/*.js
Commands are JavaScript functions you call from scripts.  `staple-gun` 
comes with core commands that can be called from anyone's scripts, and 
here's your opportunity to do the same.

Commands are good way to share your extensions with other extension
authors since they will become globally available.

examples: check-npm-version.js, launch-ios-simulator.js, s3-backup.js 
  
### /filters/*.js

Filters are a way to extend the templating system.  They are generally
short, pure functions which you can then call from your templates.

examples: kebab-case.js, camel-case.js, left-pad.js, fresh-prince.js

### /templates/*.js

You're free to create any other directories, however, these 4 have 

