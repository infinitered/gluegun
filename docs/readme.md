# Welcome to Gluegun

Gluegun is a toolkit for rapidly building Node-based command line interfaces (CLIs).

It's what powers _your_ CLI.

## Quick Example

For example, if you wanted to build a CLI that lets you search IMDB, you might have something
like this:

```
$ movie list films
$ movie info actor="Leonard Nemoy"
$ movie open imdb producer="Gene Roddenberry"
$ movie search "Star Trek"
```

This `movie` CLI could be powered by Gluegun, simply by doing this:

```
$ npm install -g gluegun
$ gluegun new movie --typescript
$ cd movie
$ npm install
$ npm link
$ movie help
```

That's it! Now you can flesh out your CLI.

## Gluegun Features

Gluegun has a toolbox full of the most common CLI tools, such as:

🌯 *parameters* - command line arguments and options<br />
🎛 *template* - generating files from templates<br />
🗄 *patching* - manipulating file contents<br />
💾 *filesystem* - moving files and directories around<br />
⚒ *system* - executing other command-line scripts<br />
🎅 *http* - interacting with API servers<br />
🛎 *prompt* - auto-complete prompts<br />
💃 *print* - printing pretty colors and tables<br />
👩‍✈️ *semver* - working with semantic versioning<br />
🎻 *strings* - manipulating strings & template data<br />

It also supports building your own plugins for _your_ CLI and bringing them in seamlessly.

## API

Read more by clicking the items to the left.

## Premium Support

[gluegun](https://github.com/infinitered/gluegun) was made by [Infinite Red](https://infinite.red/) and, like all our open source projects, is free to use and always will be. We do offer premium gluegun support and general mobile app and web design/development services. Email us at [hello@infinite.red](mailto:hello@infinite.red) to get in touch with us.
