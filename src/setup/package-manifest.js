const { readFile, writeFile } = require('fs-extra')

const packagePropertySortOrder = [
  'name',
  'version',
  'description',
  'author',
  'license',
  'private',
  'repository',
  'keywords',
  'main',
  'types',
  'bin',
  'scripts',
  'peerDependencies',
  'dependencies',
  'devDependencies',
  'eslintConfig',
  'prettier',
]

const sortObjectKeys = obj =>
  Object.keys(obj)
    .sort()
    .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {})

const addDefaultsToPackage = packageManifest => ({
  ...packageManifest,
  scripts: sortObjectKeys({
    ...packageManifest.scripts,
    build: 'mmm build',
    jest: 'mmm jest',
    'test:coverage': 'mmm test:coverage',
    'test:lint': 'mmm test:lint',
  }),
  eslintConfig: {
    extends: 'eslint-config-mmm/ts-react',
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

const updatePackageManifest = async packagePath => {
  const packageManifest = addDefaultsToPackage(
    JSON.parse(await readFile(packagePath, 'utf-8')),
  )

  const newPackage = sortAndFilterProperties(packageManifest)

  await writeFile(packagePath, JSON.stringify(newPackage, null, 2) + '\n')
}

module.exports = updatePackageManifest
