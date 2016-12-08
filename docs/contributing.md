# Contributing

Welcome!

Bug fixes, features, docs, marketing, and issue support are all contributions.


## Global Dependencies

If you're reading this, you might be interested in pitching in from a code point of view.

`gluegun` is a Node JS program. So we'll need NodeJS 7.2.  On macOS, the easiest way is:

```sh
brew install nodejs
```

`n` is a fantastic node version switcher, I highly recommend this:

```sh
npm i -g n
n 7.2
```

We'll also want the `yarn` package manager because it's fast.

```sh
npm i -g yarn
```

And let's grab lerna.  Lerna is a monorepo management tool.  We're using this because in
the future we'll have a few packages, not just the one `gluegun` as it is now.

```sh
npm i -g lerna@2.0.0-beta.31
```

## Installing `gluegun`

Next, clone the repo.

```sh
git clone git@github.com/skellock/gluegun
```

And switch to the directory and install all the dependencies.

```
cd gluegun
yarn
cd packages/gluegun
yarn
```

We'll be mostly living in the `/packages/gluegun` directory.  Documentation lives in
`/docs`. 


## Running Test And Linting

```sh
cd packages/gluegun
yarn test
yarn run lint
yarn run watch
```

## Features & Fixes

```sh
git branch fun
# furious typing
yarn run test
yarn run lint
git commit -m "Adds fun"
git push origin --HEAD
```

Please ensure lint linting & testing passes.  That'd be pretty cool.

## Submitting a PR

Jump on github on your fork.  Switch to the branch with your new changes, and 
open a PR against `master` of `skellock/gluegun`.

Screenshots of what the feature is 💯.  Animated gifs (licecap or w/e) are 💯 + 🦄.

Then submit the PR.

* It's 👌 to submit an issue before breaking changes or shenanigans to get a sense if it's cool
* It's 👌 to submit PRs to start a discussion - just mark it 🚨🚨🚨 (or whatever) to lemme know it's a conversation
* It's 👌 to submit changes to PRs not yet merged, just make sure it's related to the PR.
* If Github is complaining about conflicts, rebase.  Rebase downstream,  Merge upstream.

## Keeping up to date

You want your fork's `master` to be the same as `gluegun/master`.

```sh
# just once, run this to track our repo as `upstream`
git remote add upstream https://github.com/skellock/gluegun.git

# then when you need to update
git checkout master
git fetch upstream
git rebase upstream/master

# and here's where you'd create your branch
```



