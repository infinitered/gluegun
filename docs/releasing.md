# Releasing Gluegun

#### Once per machine

1. you have a `npm` token. Type `npm whoami`. It should say your name.
1. you have publishing rights to `gluegun` [on npm](https://www.npmjs.com/package/gluegun).
1. you have `yarn@>=1.1.0` installed (`yarn --version`). _Help us, [solidarity](https://github.com/infinitered/solidarity)! We need you!_

#### Preflight sanity checks

1. make sure you're in the project root directory
1. switch to the `master` branch: `git checkout master`
1. you have all latest updates: `git pull`
1. you have no changes to push and no staged changes.
1. install fresh dependencies: `yarn`
1. tests pass: `yarn test && yarn integration`

#### Pushing an alpha

_This will be automated a little nicer later._

1. be on the master branch: `git checkout master`
1. ensure your working tree is clean and you've pulled: `git pull && git status`
1. shipit: `npm run shipit` (yes, npm here)
1. push the np version changes up: `git push`
1. you win.

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

Every time run you update, it'll grab the latest published version.

For the CLI:

`yarn global add gluegun@next`
