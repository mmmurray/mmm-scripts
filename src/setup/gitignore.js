const { readFile, writeFile } = require('fs-extra')
const { join } = require('path')

const defaultIgnores = [
  '.DS_Store',
  'coverage',
  'lib',
  'node_modules',
  'tsconfig.json',
  'yarn-error.log',
]

const filterUnique = arr => arr.filter((item, i) => arr.indexOf(item) === i)

const tryReadLines = async path => {
  try {
    const contents = await readFile(path, 'utf-8')

    return contents
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
  } catch {
    return []
  }
}

const ensureGitIgnore = async projectRoot => {
  const gitIgnorePath = join(projectRoot, '.gitignore')
  const gitIgnoreLines = await tryReadLines(gitIgnorePath)
  const fullGitIgnoreLines = filterUnique([
    ...gitIgnoreLines,
    ...defaultIgnores,
  ]).sort()
  const fullGitIgnore = fullGitIgnoreLines.join('\n') + '\n'

  await writeFile(gitIgnorePath, fullGitIgnore)
}

module.exports = ensureGitIgnore
