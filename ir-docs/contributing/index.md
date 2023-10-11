# Contributing

_Welcome!_

Bug fixes, features, docs, marketing, and issue support are all contributions. We love it when people help out and are more than willing to give you advice, guidance, or just be a 🐥 debugger for you.

## Global Dependencies

If you're reading this, you might be interested in pitching in from a code point of view.

`gluegun` is powered by Node (7.6 or above). Install Node using `brew` (if on macOS) or by following the instructions here: [https://nodejs.org/en/download/current/](https://nodejs.org/en/download/current/)

Also install yarn: `brew install yarn` or [https://yarnpkg.com](https://yarnpkg.com).

## Installing `gluegun`

Next, fork the repo [on Github](https://github.com/infinitered/gluegun) and clone down your repo.

```sh
git clone git@github.com/<yourusername>/gluegun
```

Install all the dependencies.

```
cd gluegun
yarn
```

Gluegun's source files are mostly in `./src` and are written in [TypeScript](www.typescriptlang.org). Documentation lives in `/docs`.

## Running Tests And Linting

On macOS or Linux:

```sh
yarn test
yarn lint
yarn watch
yarn integration
```

On windows:

```sh
yarn lint
yarn windows:test
```

## Features & Fixes

```sh
git branch feature/fun
# furious typing
yarn test
yarn lint
git commit -m "Adds fun"
git push -u origin --HEAD
```

Passing tests and linting is required before we'll merge a pull request. If you need help with this, feel free to file an issue or chat with us on the [Infinite Red Community Slack](http://community.infinite.red).

## Submitting a Pull Request

Jump on Github on your fork. Switch to the branch with your new changes, and
open a PR against `master` of [infinitered/gluegun](https://github.com/infinitered/gluegun).

Screenshots of what the feature is 💯. Animated gifs (suggested apps: licecap, Gif Brewery, or Kap) are 💯 + 🦄.

Then submit the pull request.

- It's okay to submit an issue before breaking changes or shenanigans to get a sense if it's cool
- It's okay to submit PRs to start a discussion - just mark it 🚨🚨🚨 (or whatever) to let us know it's a conversation
- It's okay to submit changes to PRs not yet merged, just make sure it's related to the PR
- If Github is complaining about conflicts, rebase downstream, merge upstream

## Keeping up to date

You want your fork's `master` to be the same as `gluegun/master`.

```sh
# just once, run this to track our repo as `upstream`
git remote add upstream https://github.com/infinitered/gluegun.git

# then when you need to update
git checkout master
git pull upstream
# if on your own branch
git checkout <your branch>
git merge master

# and here's where you'd create your branch
git checkout -b feature/mybranch
```
