# gluegun

Tack on to your codebase.

# Environment File

`gluegun` is configured with gluegun.toml.  It is placed in the root directory of your project. 

The environment file wires everything up.  It provides instructions such as:

* where to find the plugins
* how to configure those plugins
* which commands to use
* defining important directories

If the current directory is doesn't have a gluegun.toml file, we will check your
$HOME/.gluegun/gluegun.toml file. 
