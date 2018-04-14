A set of functions & values to work with files and directories. The majority of these functions come
straight from [fs-jetpack](https://github.com/szwacz/fs-jetpack), a fantastic API for working with the
file system. All jetpack-based functions have an equivalent `*Async` version if you need it.

You can access these tools on the Gluegun toolbox, via `const { filesystem } = require('gluegun')`, or directly via `const { filesystem } = require('gluegun/filesystem')`.

## separator

This value is the path separator `\` or `/` depending on the OS.

```js
toolbox.filesystem.separator // '/' on posix but '\' on windows
```

## eol

This value is the end of line byte sequence.

```js
toolbox.filesystem.eol // '\n' on posix but '\r\n' on windows
```

## homedir

This function retrieves the path to the home directory.

```js
toolbox.filesystem.homedir() // '/Users/jh' on my macOS machine
```

## subdirectories

Finds the immediate subdirectories in a given directory.

```js
toolbox.filesystem.subdirectories(`~/Desktop`) // []
```

## append

[Appends](https://github.com/szwacz/fs-jetpack#appendpath-data-options) data to the end of a file.

## copy

[Copies](https://github.com/szwacz/fs-jetpack#copyfrom-to-options) a file or a directory.

## cwd

Gets the [current working directory](https://github.com/szwacz/fs-jetpack#createreadstreampath-options).

## dir

[Ensures a directory exists](https://github.com/szwacz/fs-jetpack#dirpath-criteria) and creates a new jetpack
instance with it's `cwd` pointing there.

## exists

Checks to see if file or directory [exists](https://github.com/szwacz/fs-jetpack#existspath).

## file

[Ensures a file exists](https://github.com/szwacz/fs-jetpack#filepath-criteria).

## find

[Finds](https://github.com/szwacz/fs-jetpack#findpath-searchoptions) files or directories.

## inspect

[Grabs information](https://github.com/szwacz/fs-jetpack#inspectpath-options) about a file or directory.

## inspectTree

[Grabs nested information](https://github.com/szwacz/fs-jetpack#inspecttreepath-options) about a set of files or directories.

## list

[Gets a directory listing](https://github.com/szwacz/fs-jetpack#listpath), like `ls`.

## move

[Moves](https://github.com/szwacz/fs-jetpack#movefrom-to) files and directories.

## path

[Grabs path parts](https://github.com/szwacz/fs-jetpack#pathparts) as a string.

## read

[Reads](https://github.com/szwacz/fs-jetpack#readpath-returnas) the contents of a file as a string or JSON.

## remove

[Deletes](https://github.com/szwacz/fs-jetpack#removepath) a file or directory.

## rename

[Renames](https://github.com/szwacz/fs-jetpack#renamepath-newname) a file or directory.

## symlink

[Makes a symbolic link](https://github.com/szwacz/fs-jetpack#symlinksymlinkvalue-path) to a file or directory.

## write

[Writes](https://github.com/szwacz/fs-jetpack#writepath-data-options) data to a file.
