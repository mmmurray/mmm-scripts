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
  'scripts',
  'peerDependencies',
  'dependencies',
  'devDependencies',
]

const sortPackageProperties = async packagePath => {
  const packageContents = JSON.parse(await readFile(packagePath, 'utf-8'))

  const newPackage = Object.keys(packageContents)
    .filter(name => packagePropertySortOrder.includes(name))
    .sort(
      (a, b) =>
        packagePropertySortOrder.indexOf(a) -
        packagePropertySortOrder.indexOf(b),
    )
    .reduce((acc, name) => ({ ...acc, [name]: packageContents[name] }), {})

  await writeFile(packagePath, JSON.stringify(newPackage, null, 2) + '\n')
}

module.exports = sortPackageProperties
