const { writeFile } = require('fs-extra')
const { join } = require('path')
const { hasLibOutput } = require('../helpers/config')

const packagePropertySortOrder = [
  'name',
  'version',
  'description',
  'author',
  'license',
  'private',
  'repository',
  'homepage',
  'keywords',
  'main',
  'types',
  'bin',
  'scripts',
  'peerDependencies',
  'dependencies',
  'devDependencies',
  'commitlint',
  'config',
  'eslintConfig',
  'husky',
  'prettier',
  'mmm',
]

const sortObjectKeys = obj =>
  Object.keys(obj)
    .sort()
    .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {})

const getProjectScripts = config => ({
  ...(hasLibOutput(config) ? { build: 'mmm build' } : {}),
  ...(config.test.includes('jest') ? { jest: 'mmm jest' } : {}),
  ...(config.type === 'library' ? { release: 'mmm release' } : {}),
  ...(config.test.length > 0
    ? { test: 'mmm test' }
    : { test: `echo 'No tests to run'` }),
  ...(config.test.includes('jest')
    ? { 'test:coverage': 'mmm test:coverage' }
    : {}),
  ...(config.test.includes('eslint') ? { 'test:lint': 'mmm test:lint' } : {}),
})

const addDefaultsToPackage = (packageManifest, config) => ({
  ...packageManifest,
  scripts: sortObjectKeys({
    ...packageManifest.scripts,
    commit: 'mmm commit',
    ...getProjectScripts(config),
  }),
  commitlint: {
    extends: ['@commitlint/config-conventional'],
  },
  config: {
    commitizen: {
      path: './node_modules/cz-conventional-changelog',
    },
  },
  ...(config.test.includes('eslint')
    ? {
        eslintConfig: {
          extends: 'eslint-config-mmm/ts-react',
        },
      }
    : {}),
  husky: {
    hooks: {
      'commit-msg': 'mmm precommit',
    },
  },
  prettier: 'mmm-scripts/prettier.config',
  ...(packageManifest.bin ? { bin: sortObjectKeys(packageManifest.bin) } : {}),
  ...(packageManifest.peerDependencies
    ? { peerDependencies: sortObjectKeys(packageManifest.peerDependencies) }
    : {}),
  ...(packageManifest.dependencies
    ? { dependencies: sortObjectKeys(packageManifest.dependencies) }
    : {}),
  ...(packageManifest.devDependencies
    ? { devDependencies: sortObjectKeys(packageManifest.devDependencies) }
    : {}),
})

const sortAndFilterProperties = packageManifest =>
  Object.keys(packageManifest)
    .filter(name => packagePropertySortOrder.includes(name))
    .sort(
      (a, b) =>
        packagePropertySortOrder.indexOf(a) -
        packagePropertySortOrder.indexOf(b),
    )
    .reduce((acc, name) => ({ ...acc, [name]: packageManifest[name] }), {})

const updatePackageManifest = async (
  { projectRoot, ...config },
  packageManifest,
) => {
  const packagePath = join(projectRoot, 'package.json')

  const newPackage = sortAndFilterProperties(
    addDefaultsToPackage(packageManifest, config),
  )

  await writeFile(packagePath, JSON.stringify(newPackage, null, 2) + '\n')

  return newPackage
}

module.exports = updatePackageManifest
