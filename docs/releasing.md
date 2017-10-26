# Releasing Gluegun

# TODO: update for integrated CLI

#### Once per machine

1. you have a `npm` token. Type `npm whoami`. It should say your name.
1. you have publishing rights to `gluegun` [on npm](https://www.npmjs.com/package/gluegun).
1. you have `yarn@>=1.1.0` installed (`yarn --version`). _Help us, [solidarity](https://github.com/infinitered/solidarity)! We need you!_

#### Preflight sanity checks

1. make sure you're in the project root directory
1. switch to the `master` branch: `git checkout master`
1. you have all latest updates: `git pull`
1. you have no changes to push and no staged changes.
1. nuke your dependencies: `yarn clean`
1. install fresh dependencies: `yarn bootstrap`
1. tests pass: `yarn test`

#### Pushing an alpha

This will be automated a little nicer later. I'll also update these instructions next time I release.  This time I used `yarn`.  Next time I'll try `npm`.  `yarn` is still messed up when publishing. :sad:

1. ensure you have something to release: `yarn lerna updated`, you should see both `gluegun` and `gluegun-cli`.
1. make a new branch: `git branch build-alpha-5` (or whatever)
1. bump versions: `./node_modules/.bin/lerna publish --npm-tag next`
1. at the prompt, select `custom` and enter `2.0.0-alpha.5` (or whatever number we're on).
1. select Y and press enter.
1. you win.
1. jump on github and PR your `build-alpha-2` branch back to master (`lerna` pushed it for you)


#### Verify

`yarn info gluegun dist-tags` shows you what everyone sees.

```sh
yarn info gluegun dist-tags
```
shows:
```
yarn info v1.1.0
{ latest: '1.0.0',
 next: '2.0.0-alpha.2' }
✨  Done in 0.71s.
```

#### To Use 2.0 Alphas

In your project:

`yarn add gluegun@next`

Everytime run you update, it'll grab the latest published version.
