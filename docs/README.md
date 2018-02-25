# Welcome to Gluegun

Gluegun is a toolkit for rapidly building Node-based command line interfaces (CLIs).

It's what powers _your_ CLI. It works on macOS, Linux, and Windows, and you can use TypeScript or JavaScript. Gluegun gives you the tools and gets out of the way.

## Quick Example

Let's say you want to make a `movie` CLI that does something like this:

```
$ movie list films
$ movie info actor="Leonard Nemoy"
$ movie open imdb producer="Gene Roddenberry"
$ movie search "Star Trek"
```

This `movie` CLI could be powered by Gluegun, simply by doing this on your command line (assuming you [have Node installed](https://nodejs.org/en/download/current/)):

```
$ npm install -g gluegun
$ gluegun new movie --typescript
$ cd movie
$ npm link
$ movie help

movie version 0.0.1

  help (h)       - 
  generate (g)   - 
```

That's it! Now you can flesh out your CLI. It can be simple or quite complex. See [Getting Started](/getting-started) and [Tutorial: Making a Movie CLI](/tutorial-making-a-movie-cli) for more.

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

Read more about the Gluegun Toolbox API by clicking the items to the left.

## Sponsors

[Gluegun](https://github.com/infinitered/gluegun) is sponsored by [Infinite Red](https://infinite.red/), a premium custom mobile app and web design and development agency. We are a team of designers and developers distributed across the USA and based out of Portland, Oregon and the San Francisco Bay Area. Our specialties are UI/UX design, React Native, React, and Elixir. Email [hello@infinite.red](mailto:hello@infinite.red) if you'd like to talk about your project!
