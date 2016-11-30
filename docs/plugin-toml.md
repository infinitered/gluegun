# plugin.toml


## Overview
This is the format of the configuration file which accompanies your plugin.

Everything is optional and the defaults are quite sane, however, you & I are not the 
type of people to leave well enough alone.  So let's turns some dials shall we?

I've divided up these into sections to exlain things as we go, but the `plugin.toml`
file is a single file.  Everything that appears in the code blocks are the lines
that go in the file.  Sorry if that seems obvious, just wanted to kind state that
explicitly.

## [plugin]

This section outlines details about the plugin as a whole. Things like:

* what does it do?
* where does it come from?
* what version?

```toml
[plugin]
```

### plugin.version

The version number. What that means is up to you. 
[ComVer](https://github.com/staltz/comver) is a lovely choice. So is 
[SemVer](http://semver.org).

```toml
[plugin]
version = '1.0.3'     # good - semver
version = '1.15'      # good - comver
version = 'giraffe-4' # good - 4th release of the giraffe architecture

version = '4'         # bad - is every release a breaking change?
version = ''          # bad - diy upgrade checking :(
```

### plugin.namespace
The namespace is a prefix to all your commands. 

This allows us to have *lots of plugins* with hopefully less collisions.  Users
will type this first to get to your commands. Pick something specific to
ensure you play well with others.  There is no central repo for plugins, so 
... SPARTA! Users can remap this in their project.

| | |
|----|----|
|`required`|nope|
|`type`|kebab-case, lower-case, numbers, dashes, no-whitespace|
|`defaults to`|the name of the directory|

```toml
[plugin]
namespace = 'reactotron' # good - specific
namespace = 'ignite'     # good - named after a project

namespace = 'dev'        # bad - too generic
namespace = 'facebook'   # bad - you're not facebook
namespace = ''
```

```sh
# reactotron is the namespace here:
$ staple reactotron setup
```

By default the namespace is the name of the directory that contains the plugin.toml file.  You can override this here. The end-user can also override this at their project as well.



Good examples: 'ignite', 'reactotron'
Bad examples: 'test', 'dev', 'react'

```toml
source = 'skellock/staplegun-reactotron#master'
source = 'skellock/staplegun-reactotron#master'
```

## Plugins
namespace = 'legit'

Commands will be auto-detected and named based on how
# they appear in the 'commands' directory.
#
# You can 
#
# Example of what the user will type:
#   > staple legit hello
# or
#   > staple legit.hello
[command.hello]
summary = "says hello"

# $ staple legit 
[scripts.bye]
summary = "says goodbye"

  [scripts.farewell.defaults]
