const { readdirSync, statSync, rmdir, unlink, existsSync } = require('fs')
const path = require('path')

const targetDir = process.argv.length > 2 ? process.argv[2] : null

if (targetDir == null || !existsSync(targetDir)) {
  throw Error('You must provider a valid path to clean.')
}

const getChildren = dir => readdirSync(dir).map(name => path.join(dir, name))
const stat = path => ({
  path,
  isDir: statSync(path).isDirectory(),
})
const isEmpty = ({ path, isDir }) => {
  const stats = statSync(path)
  if (!isDir) {
    return stats.size === 0
  } else {
    const children = getChildren(path)
    return children.length === 0 || children.map(stat).every(isEmpty)
  }
}

for (const { path, isDir } of getChildren(targetDir)
  .map(stat)
  .filter(isEmpty)) {
  if (isDir) {
    rmdir(path, err => (!!err ? console.log(err) : null))
  } else {
    unlink(path, err => (!!err ? console.log(err) : null))
  }
}
