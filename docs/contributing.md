# Contributing

_Welcome!_

Bug fixes, features, docs, marketing, and issue support are all contributions. We love it when people help out and are more than willing to give you advice, guidance, or just be a 🐥 debugger for you.

## Global Dependencies

If you're reading this, you might be interested in pitching in from a code point of view.

`gluegun` is powered by Node (7.6 or above). Install Node using `brew` (if on macOS) or by following the instructions here: [https://nodejs.org/en/download/current/](https://nodejs.org/en/download/current/)

## Installing `gluegun`

Next, clone the repo.

```sh
git clone git@github.com/infinitered/gluegun
```

Install all the dependencies.

```
cd gluegun
npm install
```

Gluegun's source files are mostly in `./src` and are written in [TypeScript](www.typescriptlang.org). Documentation lives in `/docs`.

## Running Tests And Linting

```sh
npm test
npm run lint
npm run watch
```

## Features & Fixes

```sh
git branch feature/fun
# furious typing
npm test
npm run lint
git commit -m "Adds fun"
git push -u origin --HEAD
```

Passing tests and linting is required before we'll merge a pull request. If you need help with this, feel free to file an issue or chat with us on the [Infinite Red Community Slack](http://community.infinite.red).

## Submitting a Pull Request

Jump on Github on your fork. Switch to the branch with your new changes, and
open a PR against `master` of [infinitered/gluegun](https://github.com/infinitered/gluegun).

Screenshots of what the feature is 💯. Animated gifs (licecap or Gif Brewery are nice for this) are 💯 + 🦄.

Then submit the pull request.

* It's 👌 to submit an issue before breaking changes or shenanigans to get a sense if it's cool
* It's 👌 to submit PRs to start a discussion - just mark it 🚨🚨🚨 (or whatever) to let us know it's a conversation
* It's 👌 to submit changes to PRs not yet merged, just make sure it's related to the PR
* If Github is complaining about conflicts, rebase downstream, merge upstream

## Keeping up to date

You want your fork's `master` to be the same as `gluegun/master`.

```sh
# just once, run this to track our repo as `upstream`
git remote add upstream https://github.com/infinitered/gluegun.git

# then when you need to update
git checkout master
git fetch upstream
git rebase upstream/master

# and here's where you'd create your branch
git checkout -b feature/mybranch
```
