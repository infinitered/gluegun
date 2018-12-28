# Releasing Gluegun

We now have CircleCI continuous integration and continous deployment set up! Thanks to Morgan Laco for setting that up.

To release, just squash and merge a pull request and prefix with one of the following:

- "fix: Some feature" - will release a patch version (aka 1.0.1)
- "feat: Some feature" - will release a feature version (aka 1.1.0)
- "feat: BREAKING CHANGE: Some breaking change" - will release a breaking version (aka 2.0.0)
- "doc: Some docs" or "chore: Some chore" won't release
