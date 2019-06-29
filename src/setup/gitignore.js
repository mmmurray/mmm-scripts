const { readFile, writeFile } = require('fs-extra')
const { join } = require('path')
const { hasLibOutput } = require('../helpers/config')

const defaultIgnores = ['.DS_Store', 'node_modules', 'yarn-error.log']

const createProjectIgnores = config => [
  ...(hasLibOutput(config) ? ['lib'] : []),
  ...(config.test.includes('jest') ? ['coverage'] : []),
  ...(config.language === 'typescript' ? ['tsconfig.json'] : []),
  ...(config.language === 'typescript' && hasLibOutput(config)
    ? ['tsconfig.build.json']
    : []),
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

const ensureGitIgnore = async ({ projectRoot, ...config }) => {
  const gitIgnorePath = join(projectRoot, '.gitignore')
  const gitIgnoreLines = await tryReadLines(gitIgnorePath)
  const fullGitIgnoreLines = filterUnique([
    ...gitIgnoreLines,
    ...defaultIgnores,
    ...createProjectIgnores(config),
  ]).sort()
  const fullGitIgnore = fullGitIgnoreLines.join('\n') + '\n'

  await writeFile(gitIgnorePath, fullGitIgnore)
}

module.exports = ensureGitIgnore
